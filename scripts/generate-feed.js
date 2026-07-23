/* Generates feed/pinterest.csv (Pinterest catalog data source) from the
   PRODUCTS and CATEGORIES arrays in js/script.js.
   Run after every product change:  node scripts/generate-feed.js */

const fs = require('fs');
const path = require('path');

const SITE = 'https://trovepicks.de';
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js', 'script.js'), 'utf8');

function extractArray(name) {
  const start = src.indexOf(`const ${name} = [`);
  if (start === -1) throw new Error(`${name} not found`);
  const open = src.indexOf('[', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') depth--;
    if (depth === 0) return eval(src.slice(open, i + 1));
  }
  throw new Error(`${name} not terminated`);
}

const PRODUCTS = extractArray('PRODUCTS');
const CATEGORIES = extractArray('CATEGORIES');
const catName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name_de || slug;

function csvField(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const header = ['id', 'title', 'description', 'link', 'image_link', 'price', 'availability', 'condition', 'product_type'];
const rows = PRODUCTS.filter((p) => p.image).map((p) => [
  p.id,
  p.title_de || p.title,
  p.description_de || p.description,
  `${SITE}/produkt/${p.id}.html`,
  p.image,
  `${p.price.toFixed(2)} EUR`,
  'in stock',
  'new',
  catName(p.category),
].map(csvField).join(','));

const outDir = path.join(root, 'feed');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(path.join(outDir, 'pinterest.csv'), [header.join(','), ...rows].join('\n') + '\n', 'utf8');
console.log(`feed/pinterest.csv geschrieben: ${rows.length} Produkte`);
