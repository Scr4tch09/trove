/* Sanity-checks the PRODUCTS catalogue: unique ids/ASINs, valid categories,
   required fields, and a matching produkt/{id}.html for every entry.
   Run after adding products:  node scripts/check-products.js */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js', 'script.js'), 'utf8');
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
const CATEGORIES = extractArray('CATEGORIES');
const slugs = new Set(CATEGORIES.map((c) => c.slug));

let errors = 0;
const fail = (msg) => { console.log('  FEHLER: ' + msg); errors++; };

const seenId = new Set();
const seenAsin = new Set();
for (const p of PRODUCTS) {
  if (seenId.has(p.id)) fail(`doppelte id: ${p.id}`);
  seenId.add(p.id);
  if (seenAsin.has(p.asin)) fail(`doppelte ASIN: ${p.asin} (${p.id})`);
  seenAsin.add(p.asin);
  if (!slugs.has(p.category)) fail(`unbekannte Kategorie "${p.category}" bei ${p.id}`);
  for (const f of ['title', 'description', 'title_de', 'description_de', 'image', 'asin']) {
    if (!p[f]) fail(`${p.id}: Feld "${f}" fehlt`);
  }
  if (typeof p.price !== 'number' || !(p.price > 0)) fail(`${p.id}: ungültiger Preis`);
  if (!/^B[A-Z0-9]{9}$/.test(p.asin)) fail(`${p.id}: ASIN-Format "${p.asin}"`);
  if (!/^https:\/\/m\.media-amazon\.com\//.test(p.image)) fail(`${p.id}: Bild-URL "${p.image}"`);
  const page = path.join(root, 'produkt', `${p.id}.html`);
  if (!fs.existsSync(page)) fail(`${p.id}: produkt/${p.id}.html fehlt`);
}

console.log(`Produkte: ${PRODUCTS.length}`);
console.log('Pro Kategorie:');
for (const c of CATEGORIES) {
  const n = PRODUCTS.filter((p) => p.category === c.slug).length;
  console.log(`  ${c.slug.padEnd(15)} ${n}`);
}
console.log(errors ? `\n${errors} Fehler gefunden.` : '\nAlle Prüfungen bestanden.');
process.exit(errors ? 1 : 0);
