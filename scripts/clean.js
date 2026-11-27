import { lstat, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = await realpath(fileURLToPath(new URL('..', import.meta.url)));

for (const name of ['dist', 'playwright-report', 'test-results']) {
  const target = path.resolve(project, name);
  if (path.dirname(target) !== project) {
    throw new Error(`Der Pfad liegt außerhalb des Projektverzeichnisses: ${target}`);
  }

  const info = await lstat(target).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (!info) continue;
  if (!info.isDirectory()) {
    console.error(`Übersprungen, kein reguläres Verzeichnis: ${name}`);
    process.exitCode = 1;
    continue;
  }

  await rm(target, { recursive: true, force: true });
  console.log(`Bereinigt: ${name}/`);
}
