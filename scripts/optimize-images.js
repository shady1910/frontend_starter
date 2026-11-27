import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, realpath, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const settings = { width: 1920, quality: 80 };
const cacheVersion = 1;
const project = await realpath(fileURLToPath(new URL('..', import.meta.url)));
const imageDirectory = path.join('src', 'assets', 'images');
const originals = path.join(project, imageDirectory, 'originals');
const optimized = path.join(project, imageDirectory, 'optimized');
const cachePath = path.join(optimized, '.image-optimization-cache.json');
const formats = new Set(['jpeg', 'png', 'webp']);
const settingsKey = digest(JSON.stringify({ cacheVersion, settings, sharp: sharp.versions }));

function digest(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function checkDirectory(directory, create = false) {
  let current = project;
  for (const segment of path.relative(project, directory).split(path.sep)) {
    current = path.join(current, segment);
    if (create)
      await mkdir(current).catch((error) => {
        if (error.code !== 'EEXIST') throw error;
      });
    // Keine symbolischen Links in den Pfaden für Eingabe, Ausgabe oder Cache.
    if (!(await lstat(current)).isDirectory()) {
      throw new Error(`Kein reguläres Verzeichnis: ${path.relative(project, current)}`);
    }
  }
}

async function collect(directory, files, directories) {
  for (const entry of await readdir(path.join(originals, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      directories.push(relative);
      await collect(relative, files, directories);
    } else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(relative);
    }
  }
}

function portableKey(relative) {
  return relative
    .split(path.sep)
    .map((segment) =>
      segment
        .normalize('NFC')
        .toLowerCase()
        .replace(/[. ]+$/u, ''),
    )
    .join('/');
}

function planOutputs(files, directories) {
  const occupied = new Set(directories.map(portableKey));
  const collisions = [];
  const outputs = new Map();

  for (const input of files.sort()) {
    const { dir, name, ext } = path.parse(input);
    const output = path.join(dir, `${name}.webp`);
    const key = portableKey(output);
    if (occupied.has(key)) {
      collisions.push({ input, dir, name, extension: ext.slice(1).toLowerCase() });
      continue;
    }
    occupied.add(key);
    outputs.set(input, output);
  }

  for (const { input, dir, name, extension } of collisions) {
    let output = path.join(dir, `${name}.${extension}.webp`);
    let sequence = 2;
    while (occupied.has(portableKey(output))) {
      output = path.join(dir, `${name}.${extension}-${sequence}.webp`);
      sequence += 1;
    }
    occupied.add(portableKey(output));
    outputs.set(input, output);
  }
  return outputs;
}

async function readRegularFile(file) {
  try {
    if (!(await lstat(file)).isFile()) {
      throw new Error(`Keine reguläre Datei: ${path.relative(project, file)}`);
    }
    return await readFile(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  }
}

async function writeAtomically(file, content) {
  const temporary = path.join(path.dirname(file), `.image-opt-${randomUUID()}.tmp`);
  await writeFile(temporary, content, { flag: 'wx' });
  try {
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}

// Sharp meldet Frames für WebP. Bei APNG zeigt ein acTL-Chunk vor IDAT die Animation an.
function isAnimatedPng(input) {
  for (let offset = 8; offset + 12 <= input.length;) {
    const length = input.readUInt32BE(offset);
    if (offset + 12 + length > input.length) return false;
    const type = input.toString('ascii', offset + 4, offset + 8);
    if (type === 'acTL') return true;
    if (type === 'IDAT' || type === 'IEND') return false;
    offset += length + 12;
  }
  return false;
}

async function optimize(relative, output, previous) {
  const input = await readRegularFile(path.join(originals, relative));
  if (!input) throw new Error('Quelldatei ist nicht mehr vorhanden.');

  const key = digest(input);
  const destination = path.join(optimized, output);
  await checkDirectory(path.dirname(destination), true);
  const existing = await readRegularFile(destination);

  if (
    existing &&
    previous?.input === key &&
    previous.settings === settingsKey &&
    previous.output === digest(existing)
  ) {
    return { status: 'cached', entry: previous, sourceBytes: input.length, bytes: existing.length };
  }

  const image = sharp(input);
  const { format, pages = 1, delay } = await image.metadata();
  if (
    !formats.has(format) ||
    pages > 1 ||
    delay?.length ||
    (format === 'png' && isAnimatedPng(input))
  ) {
    return { status: 'skipped' };
  }

  const result = await image
    .autoOrient()
    .resize({ width: settings.width, withoutEnlargement: true })
    .webp({ quality: settings.quality })
    .toBuffer();
  await writeAtomically(destination, result);
  return {
    status: 'processed',
    sourceBytes: input.length,
    bytes: result.length,
    entry: { input: key, settings: settingsKey, output: digest(result) },
  };
}

const report = {
  found: 0,
  processed: 0,
  cached: 0,
  skipped: 0,
  sourceBytes: 0,
  bytes: 0,
  errors: 0,
};

function recordError(location, error) {
  report.errors += 1;
  console.error(`${location}: ${error.message}`);
}

try {
  await checkDirectory(originals);
  await checkDirectory(optimized, true);
  const files = [];
  const directories = [];
  await collect('', files, directories);
  const outputs = planOutputs(files, directories);
  report.found = outputs.size;

  const previous = await readRegularFile(cachePath);
  let cached = {};
  if (previous) {
    try {
      cached = JSON.parse(previous.toString('utf8')) ?? {};
    } catch (error) {
      console.warn(`Cache wird neu erstellt: ${error.message}`);
    }
  }
  const current = Object.create(null);
  for (const [relative, output] of outputs) {
    const cacheKey = output.split(path.sep).join('/');
    try {
      const result = await optimize(relative, output, cached[cacheKey]);
      report[result.status] += 1;
      if (result.entry) {
        current[cacheKey] = result.entry;
        report.sourceBytes += result.sourceBytes;
        report.bytes += result.bytes;
      } else {
        console.log(`Übersprungen (animiert oder ungeeignet): ${relative}`);
      }
    } catch (error) {
      recordError(relative, error);
    }
  }
  const next = JSON.stringify(current, null, 2) + '\n';
  if (previous?.toString('utf8') !== next) await writeAtomically(cachePath, next);
} catch (error) {
  recordError('Bildoptimierung', error);
}

const savings = report.sourceBytes - report.bytes;
const percent = report.sourceBytes ? (savings / report.sourceBytes) * 100 : 0;
console.log(
  [
    `Erkannte Bilder: ${report.found}`,
    `Verarbeitet: ${report.processed}`,
    `Übersprungen: ${report.cached + report.skipped} (${report.cached} unverändert)`,
    `Vergleichbare Originalgröße: ${report.sourceBytes} B`,
    `Vergleichbare WebP-Größe: ${report.bytes} B`,
    `Ersparnis: ${savings} B (${percent.toFixed(2)} %)`,
    `Fehler: ${report.errors}`,
  ].join('\n'),
);

if (report.errors) process.exitCode = 1;
