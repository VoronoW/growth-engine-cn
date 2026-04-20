import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cssPath = path.join(rootDir, 'zapex-system.css');

const standalonePairs = [
  ['homepage-v2.html', 'homepage-v2-standalone.html'],
  ['system-and-modules-v2.html', 'system-and-modules-v2-standalone.html'],
  ['delivery-and-cases-v2.html', 'delivery-and-cases-v2-standalone.html'],
  ['news-and-cases-v2.html', 'news-and-cases-v2-standalone.html'],
  ['assessment-v2.html', 'assessment-v2-standalone.html'],
];

const rootFiles = [
  'index.html',
  'homepage-v2.html',
  'homepage-v2-standalone.html',
  'system-and-modules-v2.html',
  'system-and-modules-v2-standalone.html',
  'delivery-and-cases-v2.html',
  'delivery-and-cases-v2-standalone.html',
  'news-and-cases-v2.html',
  'news-and-cases-v2-standalone.html',
  'assessment-v2.html',
  'assessment-v2-standalone.html',
  'privacy.html',
  'terms.html',
  'growth-forms.html',
  'zapex-system.css',
  'zapex-system-mobile.css',
  'feishu-config.js',
];

async function rebuildStandalone(sourceName, standaloneName, css) {
  const sourcePath = path.join(rootDir, sourceName);
  const standalonePath = path.join(rootDir, standaloneName);
  const source = await readFile(sourcePath, 'utf8');
  const standalone = source.replace(
    /<link rel="stylesheet" href="\.\/zapex-system\.css"\s*\/?>/,
    `<style>\n${css}\n</style>`,
  );
  await writeFile(standalonePath, standalone, 'utf8');
}

async function copyIntoDist(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { recursive: true });
}

async function main() {
  const css = await readFile(cssPath, 'utf8');

  for (const [sourceName, standaloneName] of standalonePairs) {
    await rebuildStandalone(sourceName, standaloneName, css);
  }

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  for (const relativePath of rootFiles) {
    await copyIntoDist(relativePath);
  }

  await copyIntoDist('assets');
  await copyIntoDist('archive');
  await writeFile(
    path.join(distDir, '_redirects'),
    await readFile(path.join(rootDir, 'public/_redirects'), 'utf8'),
    'utf8',
  );

  console.log('Static site build complete:', distDir);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
