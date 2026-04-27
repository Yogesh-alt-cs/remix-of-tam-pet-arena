import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const catalogPath = path.join(root, 'src/lib/species-catalog.ts');
const catalog = fs.readFileSync(catalogPath, 'utf8');
const missing = [];

function record(kind, file, expectedPath) {
  missing.push({ species: kind, file, expectedPath });
}

const urlRegex = /new URL\(["']([^"']+)["'],\s*import\.meta\.url\)\.href/g;
for (const match of catalog.matchAll(urlRegex)) {
  const rel = match[1];
  const expected = path.resolve(path.dirname(catalogPath), rel);
  if (!fs.existsSync(expected)) record('catalog asset', rel, path.relative(root, expected));
}

if (catalog.includes('from "@/assets') || catalog.includes("from '@/assets")) {
  record('species-catalog', '@/assets import', 'Use new URL("../assets/...", import.meta.url).href instead of alias imports');
}

const fallback = path.join(root, 'public/assets/fallback/default-pet.png');
if (!fs.existsSync(fallback)) record('fallback', 'default-pet.png', 'public/assets/fallback/default-pet.png');

const requiredCounts = { Common: 30, Rare: 20, Epic: 10, Legendary: 5, Mythic: 2 };
for (const [rarity, min] of Object.entries(requiredCounts)) {
  const count = (catalog.match(new RegExp(`rarity:\\s*["']${rarity}["']`, 'g')) || []).length;
  if (count < min) record(`${rarity} roster`, `${count}/${min}`, `species-catalog.ts must define at least ${min} ${rarity} species`);
}

const requiredAssetGroups = ['SPRITES', 'PORTRAITS', 'ANIMATION_FRAMES', 'RARITY_FRAMES', 'ELEMENT_ICONS', 'BATTLE_VFX'];
for (const group of requiredAssetGroups) {
  if (!catalog.includes(`const ${group}`) && !catalog.includes(`export const ${group}`)) {
    record('asset group', group, `species-catalog.ts missing ${group}`);
  }
}

if (missing.length) {
  console.error('\nAsset validation failed.\n');
  for (const item of missing) {
    console.error(`Missing asset:\nspecies: ${item.species}\nfile: ${item.file}\nexpected path: ${item.expectedPath}\n`);
  }
  process.exit(1);
}

console.log('Asset validation passed. Catalog assets, fallback image, roster counts, and asset groups are present.');
