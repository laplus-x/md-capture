import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const pkgVersion = pkg.version;

const wxtConfig = readFileSync(join(root, 'wxt.config.ts'), 'utf8');
const manifestVersionMatch = wxtConfig.match(/version\s*:\s*['"]([^'"]+)['"]/);
if (!manifestVersionMatch) {
  console.error('Manifest version not found in wxt.config.ts');
  process.exit(1);
}
const manifestVersion = manifestVersionMatch[1];

if (pkgVersion !== manifestVersion) {
  console.error(
    `Version mismatch: package.json ${pkgVersion} != wxt.config.ts ${manifestVersion}`,
  );
  process.exit(1);
}

const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
const versionHeader = new RegExp(`^## \\[${pkgVersion}\\]`, 'm');
if (!versionHeader.test(changelog)) {
  console.error(`Changelog entry for ${pkgVersion} not found`);
  process.exit(1);
}

console.log(`Version validation passed: ${pkgVersion}`);
