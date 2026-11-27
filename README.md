# frontend-starter

Diese Vorlage ist der Ausgangspunkt für eine statische, responsive Website mit einer einzelnen
HTML-Seite. Die Beispielseite zeigt ein Layout mit klassischen HTML-Sektionen, einem lokal
eingebundenen WebP-Bild und einem mobil einklappbaren Menü. Inhalte und Ankerlinks sind auch bei
deaktiviertem JavaScript nutzbar.

Der Stack besteht aus HTML5, CSS, Tailwind CSS 4, Vanilla JavaScript mit ES-Modulen, Vite und npm.
Alle npm-Pakete sind Entwicklungsabhängigkeiten. Für die Veröffentlichung genügt ein statischer
Webserver.

## Voraussetzungen und Installation

- Node.js 22 LTS ab **22.16.0**. Die Datei `.nvmrc` wählt die 22er-Linie. Verwende einen
  aktuellen Patchstand dieser Linie. Das Feld `engines` erlaubt zusätzlich Node.js 24 und 26 LTS.
- npm als Paketmanager. Die Vorlage wurde mit Node.js 22.16.0 und npm 11.6.2 geprüft.
- Die Chromium-Headless-Umgebung von Playwright für die Browserprüfungen.

Öffne den Projektordner im Terminal. Wenn du nvm und Node.js 22 bereits installiert hast, wähle die
Version mit `nvm use`.

```bash
npm ci
npx playwright install chromium --only-shell
npm run dev
```

Playwright lädt Chromium in seinen Benutzer-Cache. Auf Linux können zusätzliche
[Systembibliotheken für Chromium](https://playwright.dev/docs/browsers#install-system-dependencies)
erforderlich sein. Installiere die Browser-Binaries nach Playwright-Updates erneut. Vite zeigt die
lokale URL beim Start an und aktualisiert die Seite bei Änderungen. Verwende `npm ci` für
reproduzierbare Installationen und versioniere `package-lock.json` zusammen mit `package.json`.

## Projektstruktur

```text
frontend-starter/
├── .vscode/                     Editor-Einstellungen und Erweiterungen
├── public/                      Statische Dateien, die Vite unverändert kopiert
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── fonts/               Lokale Schriften
│   │   └── images/
│   │       ├── originals/       Quellen für die Bildoptimierung
│   │       └── optimized/       WebP-Dateien zur Verwendung auf der Seite
│   ├── css/main.css             Tailwind-Einstieg, Design-Tokens und eigene Stile
│   └── js/
│       ├── main.js              Moduleinstieg der Website
│       └── modules/navigation.js
├── scripts/                     Bildoptimierung und Bereinigung
├── tests/accessibility.spec.js  Automatisierte Browserprüfungen
├── index.html                    Einstieg und vollständiger Seiteninhalt
├── package.json
├── package-lock.json
└── dist/                         Generierte Produktionsdateien
```

Die Dateien im Projektwurzelverzeichnis konfigurieren EditorConfig, Prettier, HTMLHint, ESLint,
Stylelint, Playwright und Vite. Git ignoriert generierte Dateien, Umgebungsdateien und lokale Caches.
Die Originale, WebP-Dateien und VS-Code-Konfigurationen können versioniert werden.

## npm-Befehle

| Befehl                    | Funktion                                                          |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run dev`             | Vite-Entwicklungsserver mit Hot Module Replacement starten        |
| `npm run build`           | Produktionsdateien in `dist/` erzeugen                            |
| `npm run preview`         | Vorhandenen Produktions-Build lokal öffnen                        |
| `npm run format`          | HTML, CSS, JavaScript, JSON und Markdown mit Prettier formatieren |
| `npm run format:check`    | Formatierung überprüfen                                           |
| `npm run lint`            | ESLint, Stylelint und HTMLHint ausführen                          |
| `npm run lint:js`         | JavaScript einschließlich Scripts, Tests und Konfiguration prüfen |
| `npm run lint:css`        | CSS unter `src/` mit Stylelint prüfen                             |
| `npm run lint:html`       | `index.html` mit HTMLHint prüfen                                  |
| `npm run lint:fix`        | ESLint- und Stylelint-Korrekturen anwenden und HTML prüfen        |
| `npm run test:a11y`       | Playwright-Prüfungen in Chromium starten                          |
| `npm run images:optimize` | WebP-Dateien aus Originalbildern erzeugen oder aktualisieren      |
| `npm run check`           | Formatierung, Linting und Barrierefreiheit prüfen                 |
| `npm run clean`           | `dist/`, `playwright-report/` und `test-results/` entfernen       |

## Entwicklungsworkflow

1. Starte `npm run dev` und bearbeite Inhalte in `index.html`.
2. Passe Design-Tokens in `src/css/main.css` an. Lege zusätzliche JavaScript-Module unter
   `src/js/modules/` ab und importiere sie bei Bedarf aus `src/js/main.js`.
3. Lege neue Rasterbilder unter `src/assets/images/originals/` ab, führe
   `npm run images:optimize` aus und verlinke die erzeugten WebP-Dateien.
4. Führe `npm run format` und `npm run check` aus.
5. Erzeuge `dist/` mit `npm run build` und kontrolliere die Ausgabe mit `npm run preview`.

Die Navigation ist ein normaler Satz von Ankerlinks. Das Modul macht auf kleinen Viewports daraus
ein aufklappbares Menü. Es synchronisiert `aria-expanded`, schließt bei Escape und setzt den Fokus
dabei zurück auf den Menübutton. Ändere einen Navigations-Breakpoint im Stylesheet und im Modul
gemeinsam. Für weitere Funktionen nutze die nativen Elemente und Ereignisse des Browsers.

### Formatierung, Linting und VS Code

Öffne `frontend-starter/` als Workspace und installiere die empfohlenen Erweiterungen aus
`.vscode/extensions.json`. Prettier übernimmt das Formatieren beim Speichern. EditorConfig
vereinheitlicht Einrückung, UTF-8 und LF-Zeilenenden. ESLint, Stylelint und HTMLHint zeigen
Diagnosen an. Tailwind CSS IntelliSense verwendet `src/css/main.css`.

ESLint verwendet die Flat Config und unterscheidet Browser-Code und Node.js-Werkzeuge. Stylelint
erweitert `stylelint-config-standard` und erlaubt gezielt die Tailwind-Direktiven und
Text-Token-Suffixe. Die Kombination Stylelint 17 und Standard-Konfiguration 40 unterstützt die
hier geprüfte Node.js-Version. Stylelint 18 verlangt in der 22er-Linie mindestens Node.js 22.22.2.

Die HTMLHint-Version wird mit einem eng auf HTMLHint begrenzten npm-Override auf gepatchte
Versionen von `glob` und `minimatch` aufgelöst. Prüfe nach Aktualisierungen von HTMLHint, ob
dieser Override noch erforderlich ist, und führe `npm audit` erneut aus.

### Tailwind CSS und eigene CSS-Regeln

Die offizielle Vite-Integration verarbeitet Tailwind beim Entwickeln und Bauen. Die CSS-first-
Konfiguration liegt in `src/css/main.css`. `@source` legt die durchsuchten Quellen fest. Ergänze
weitere Quellpfade dort, wenn dein Projekt zusätzliche HTML- oder JavaScript-Dateien außerhalb
der bestehenden Pfade erhält.

Im `@theme`-Block liegen die zentralen Farben für Primär-, Sekundär- und Akzentflächen,
Hintergründe und Text, die Schriftfamilie und Schriftgrößen, Abstände, Radien, Schatten und die
Containerbreite. Nutze die Variablen direkt in CSS, etwa `var(--color-primary)`, oder über
Utilities wie `bg-primary`, `text-intro` und `py-section`. Eigene Grundregeln liegen in
`@layer base`, wiederverwendbare Klassen in `@layer components`. Halte Utility-Namen in
JavaScript vollständig ausgeschrieben, damit Tailwind sie bei der Quellanalyse erkennen kann.
Prettier sortiert Klassen anhand desselben Stylesheets, das Vite verarbeitet.

### Lokale Schriften

Die Vorlage nutzt Systemschriftarten. Wenn du eine Schrift mit passender Weblizenz einbindest,
lege sie als WOFF2 in `src/assets/fonts/` ab. Ergänze je nach verfügbarer Schrift und
Schriftgewicht einen passenden `@font-face`-Block und ändere `--font-sans` im Theme.

```css
@font-face {
  font-family: 'Projektschrift';
  src: url('../assets/fonts/projektschrift.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

Der Pfad und der Gewichtsbereich illustrieren eine lokal installierte variable Schrift und sind
an die tatsächlich vorhandene Datei anzupassen. Vite übernimmt den relativen Pfad und Hash im
Produktions-Build.

## Bildoptimierung

Sharp liest JPEG, JPG, PNG und WebP rekursiv aus `src/assets/images/originals/`.
Groß- und Kleinschreibung der Dateiendungen sind unerheblich. SVG und sonstige nicht
unterstützte Dateitypen werden ignoriert. Animiertes WebP und APNG werden übersprungen.
Die Originale bleiben erhalten. Die Optimierung wird bewusst über
`npm run images:optimize` gestartet.

Die zentralen Einstellungen in `scripts/optimize-images.js` sind **1920 Pixel maximale Breite**
und **WebP-Qualität 80**. Sharp wendet zuerst die EXIF-Ausrichtung an, behält das Seitenverhältnis
und die Transparenz bei, verkleinert bei Bedarf und entfernt unnötige Metadaten. Kleine Bilder
behalten ihre Abmessungen.

`originals/gallery/foto.jpg` erscheint als `optimized/gallery/foto.webp`. Teilen sich mehrere
Dateien einen Basisnamen, erhält eine davon den einfachen Namen. Die übrigen bekommen einen
Endungszusatz wie `foto.png.webp` und falls nötig eine Nummer. Die Zuordnung ist für denselben
Quellbestand deterministisch. Prüfe bei neuen Kollisionen oder umbenannten Quellen die
Bildreferenzen. Vorhandene WebP-Dateien zu entfernten Quellen werden für bestehende Referenzen
beibehalten und können gezielt von Hand entfernt werden.

Ein ignorierter Cache vergleicht den Inhalt der Quelle, die Optimierungseinstellungen, die
Sharp-Versionen und die erzeugte Datei. Verglichen werden im Ergebnisbericht ausschließlich
Quellen mit erzeugter oder bestätigter aktueller Ausgabe. Bei sehr kleinen oder bereits stark
komprimierten Quellen kann die Ersparnis negativ sein.

Binde verwendete Bilder direkt aus `src/assets/images/optimized/` ein. Vite nimmt referenzierte
Dateien in den Build auf. Die Beispielseite nutzt eine lokale, generierte Hero-Grafik:

```html
<img
  src="/src/assets/images/optimized/hero.webp"
  alt="Grüner Bogen, gefaltete Fläche, orangefarbene Kugel und heller Würfel im Seitenlicht"
  width="1402"
  height="1122"
  fetchpriority="high"
/>
```

- Gib `width` und `height` entsprechend den Abmessungen der WebP-Datei an. CSS skaliert das Bild
  passend zum Layout. Prüfe den Alternativtext im Seitenkontext. Rein dekorative Bilder
  erhalten ein leeres `alt=""`.
- Setze `loading="lazy"` bei Bildern weiter unten auf der Seite ein. Das sichtbare Hero-Bild
  wird sofort geladen.
- Verwende `srcset` nur für wirklich vorhandene Varianten. Das Script erzeugt genau eine
  Ausgabe pro Eingabedatei. Für mehrere Breiten bereite entsprechend benannte und passende
  Eingabedateien vor, optimiere sie und verwende die tatsächlichen Ausgabebreiten als
  `w`-Deskriptoren. `sizes` beschreibt die gerenderte Breite je Viewport, damit der Browser
  eine passende Datei wählen kann.
- Verwende `picture`, wenn verschiedene Viewports unterschiedliche Bildausschnitte brauchen.
  Gib die tatsächlich vorhandenen Dateien in `source` an und behalte ein `img` als Fallback.

## Barrierefreiheit prüfen

`npm run test:a11y` startet vorübergehend einen lokalen Entwicklungsserver auf
`127.0.0.1:4174`. Playwright beendet den Testserver nach dem Lauf. Chromium prüft Desktop und
einen mobilen Viewport. axe scannt die unterstützten A- und AA-Regeln aus WCAG 2.0, 2.1 und 2.2
einschließlich der Zielgröße. Die Suite prüft zusätzlich den Skip-Link, die Tastaturbedienung
des mobilen Menüs und die Ankerlinks ohne JavaScript. Bei Funden zeigt der Test die Regel und
betroffene HTML-Elemente. Der Bericht liegt in `playwright-report/`.

Automatisierte Tests ersetzen keine vollständige manuelle Barrierefreiheitsprüfung und
garantieren keine WCAG-2.2-AA-Konformität. Prüfe die angepasste Website manuell mit Tastatur,
Screenreader, vergrößertem Text und Zoom sowie mit reduzierter Bewegung. Kontrolliere dabei
insbesondere Fokusreihenfolge, Kontraste, Alternativtexte und die Bedienbarkeit bei schmaler
Darstellung.

## Build und Deployment

```bash
npm run build
npm run preview
```

Vite bündelt und minifiziert CSS und JavaScript. Verarbeitete Assets erhalten Dateinamen mit
Hashes. Dateien aus `public/` werden mit ihren festen Namen kopiert. Lade den **Inhalt von
`dist/`** per Hosting-Dateimanager, SFTP oder deinem Deployment-Workflow auf den Webserver.
Der Zielordner muss `index.html` als Indexdatei ausliefern. Hosts können die Dateitypen aus den
Endungen ableiten. Die Site benötigt weder Node.js auf dem Server noch Routing-Rewrites.

Der Vite-Standard dieser Vorlage ist `base: './'`. Dadurch verwendet die erzeugte HTML-Datei
relative Asset-URLs. Derselbe Build funktioniert in der Domainwurzel und in einem
Unterverzeichnis wie `/projekt/`. Öffne Unterverzeichnisse mit abschließendem Slash oder mit
`/projekt/index.html`. Konfiguriere andernfalls eine Weiterleitung, damit der Browser relative
Pfade auf der richtigen Ebene auflöst. Teste über HTTP mit `npm run preview` oder auf dem
Webserver, da Modulskripte bei `file://` an Browser-Sicherheitsregeln scheitern können.

Für eine dauerhaft bekannte Deployment-URL kannst du mit
`npm run build -- --base=/projekt/` einen festen Basispfad setzen. Dieser Build ist an den Pfad
gebunden. Vite passt statisch erkannte URLs in HTML, CSS und Modul-Imports an. Für dynamisch
zusammengesetzte Asset-URLs nutze `import.meta.env.BASE_URL`. Öffentliche Canonical- und Open-Graph-
URLs sowie Sitemap-Pfade setzt du nach dem tatsächlichen Hosting-Standort. Siehe
[Vite zur relativen Base](https://vite.dev/guide/build#relative-base).

### Suchmaschinen und Metadaten

Die Beispielseite enthält `noindex, follow`. Die mitgelieferte `robots.txt` erlaubt das Crawlen,
damit Suchmaschinen die Meta-Direktive lesen können. Entferne `noindex`, sobald die fertige
Website indexiert werden soll. Prüfe gleichzeitig Robots-Meta, eventuelle `X-Robots-Tag`-Header
und die Datei `/robots.txt` im **Wurzelverzeichnis der Domain**. Bei Unterverzeichnis-Hosting
gilt die Robots-Datei der Domain. Die mitgebaute Datei im Unterverzeichnis wird dafür nicht
herangezogen.

Ergänze bei Veröffentlichung die tatsächliche absolute Canonical-URL, `og:url` und
`og:image`. Ergänze eine Sitemap mit echten URLs bei Bedarf und verlinke sie in der
Robots-Datei der Domain. Verwende strukturierte Daten nur, wenn sie zu den veröffentlichten
Inhalten passen. Lege bei Bedarf vor dem Launch fest, ob Suchmaschinen die Website aufnehmen
sollen.

## Vorlage für ein neues Projekt verwenden

Kopiere die Projektdateien in einen neuen Ordner oder übernimm sie über GitHub. Benenne das Paket
in `package.json` um und führe `npm install --package-lock-only` aus, um den Namen im Lockfile zu
synchronisieren. Verwende danach wieder `npm ci`.

Für ein [GitHub Template Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
lege später ein Repository namens `frontend-starter` an, übertrage deinen gewünschten
Quellstand und aktiviere in dessen Einstellungen **Template repository**. Neue Projekte können
anschließend über **Use this template** erstellt werden.

### Checkliste vor der Veröffentlichung

- [ ] Projektname in Paketmetadaten, Lockfile und sichtbarer Website angepasst
- [ ] Seitentitel und Meta Description angepasst
- [ ] Sprachdeklaration geprüft
- [ ] Favicon ersetzt
- [ ] Design-Tokens angepasst
- [ ] Bilder optimiert, Bilddimensionen und Alternativtexte geprüft
- [ ] Barrierefreiheit automatisiert und manuell geprüft
- [ ] Indexierungseinstellungen und Robots-Datei der Domain geprüft
- [ ] Canonical-URL ergänzt
- [ ] Open-Graph-Angaben einschließlich Seiten-URL und Vorschaubild ergänzt
- [ ] Sitemap und strukturierte Daten bei Bedarf ergänzt
- [ ] Qualitätsprüfungen erfolgreich
- [ ] Produktions-Build erfolgreich und unter der vorgesehenen Ziel-URL geprüft
