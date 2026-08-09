/* Compares the catalogue's prices against the current amazon.de prices.
   Read-only: prints a report and exits 1 if anything drifted or went
   unavailable, so it can gate a scheduled run.
     node scripts/check-prices.js           report only
     node scripts/check-prices.js --write    also update js/script.js
   Amazon serves the full product page to a plain request as long as a
   normal browser User-Agent and German locale are sent. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const file = path.join(root, 'js', 'script.js');
const src = fs.readFileSync(file, 'utf8');
const write = process.argv.includes('--write');

function extractArray(name) {
  const start = src.indexOf(`const ${name} = [`);
  const open = src.indexOf('[', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') depth--;
    if (depth === 0) return eval(src.slice(open, i + 1));
  }
}
const PRODUCTS = extractArray('PRODUCTS');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function fetchPage(asin) {
  return execFileSync('curl', [
    '-s', '-L', '--compressed', '--max-time', '45',
    '-A', UA,
    '-H', 'Accept-Language: de-DE,de;q=0.9',
    '-H', 'Accept: text/html,application/xhtml+xml',
    `https://www.amazon.de/dp/${asin}`,
  ], { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
}

// "1.234,56 €" -> 1234.56
function parsePrice(s) {
  const m = s.match(/([\d.]+,\d{2})\s*€/);
  if (!m) return null;
  return parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
}

function priceFrom(html) {
  let m = html.match(/<span class="a-price-whole">([\d.]+)<span class="a-price-decimal">,<\/span><span class="a-price-fraction">(\d{2})/);
  if (m) return parseFloat(m[1].replace(/\./g, '') + '.' + m[2]);
  m = html.match(/"priceAmount"\s*:\s*([\d.]+)/);
  if (m) return parseFloat(m[1]);
  m = html.match(/class="a-offscreen">\s*([\d.]+,\d{2})\s*€/);
  if (m) return parsePrice(m[1] + ' €');
  return null;
}

const drift = [];
const problems = [];
const unchanged = [];

for (const p of PRODUCTS) {
  let html;
  try {
    html = fetchPage(p.asin);
  } catch (e) {
    problems.push(`${p.id}: Abruf fehlgeschlagen (${e.code || e.message})`);
    continue;
  }
  if (html.length < 100000 || /Geben Sie die Zeichen unten ein|api-services-support@amazon/.test(html)) {
    problems.push(`${p.id}: Bot-Prüfung statt Produktseite (${html.length} Zeichen)`);
    continue;
  }
  // Only trust the availability block itself — the phrase also appears in
  // hidden widgets and script strings elsewhere on the page.
  const avail = html.match(/id="availability"[\s\S]{0,600}?<\/div>/);
  if (avail && /Derzeit nicht verfügbar|Currently unavailable|Nicht auf Lager/.test(avail[0])) {
    problems.push(`${p.id}: derzeit nicht verfügbar`);
  } else if (avail && /Nur noch (\d+) auf Lager/.test(avail[0])) {
    problems.push(`${p.id}: nur noch ${avail[0].match(/Nur noch (\d+) auf Lager/)[1]} auf Lager`);
  }
  const now = priceFrom(html);
  if (now == null) {
    problems.push(`${p.id}: kein Preis gefunden`);
    continue;
  }
  if (Math.abs(now - p.price) > 0.005) drift.push({ id: p.id, old: p.price, now });
  else unchanged.push(p.id);
}

console.log(`Geprüft: ${PRODUCTS.length} Produkte`);
console.log(`Unverändert: ${unchanged.length}`);
console.log(`Preisänderungen: ${drift.length}`);
for (const d of drift) {
  const diff = d.now - d.old;
  console.log(`  ${d.id.padEnd(22)} ${d.old.toFixed(2).padStart(8)} -> ${d.now.toFixed(2).padStart(8)}  (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`);
}
if (problems.length) {
  console.log(`\nProbleme: ${problems.length}`);
  for (const w of problems) console.log('  ' + w);
}

if (write && drift.length) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const d of drift) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`{ id: '${d.id}', asin:`)) {
        lines[i] = lines[i].replace(/price: [\d.]+,/, `price: ${d.now.toFixed(2)},`);
        break;
      }
    }
  }
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log(`\n${drift.length} Preise in js/script.js aktualisiert.`);
}

process.exit(drift.length || problems.length ? 1 : 0);
