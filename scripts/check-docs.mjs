import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkpoint = JSON.parse(readFileSync(join(root, 'source-checkpoint.json'), 'utf8'));
const read = (file) => readFileSync(join(root, file), 'utf8');
const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}
function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : /\.mdx?$/.test(file) ? [file] : [];
  });
}
for (const file of markdownFiles(join(root, 'docs'))) {
  const content = readFileSync(file, 'utf8');
  check(!/gamevault|gamevau\.lt|WEB_UI_|SERVER_WEB_UI_ENABLED|SERVER_LANDING_PAGE_ENABLED/i.test(content), `Obsolete product/configuration in ${file}`);
}
const configuration = read('docs/server-docs/configuration.md');
for (const key of checkpoint.backendEnvironmentKeys) {
  check(configuration.includes('`' + key + '`'), `Missing backend setting ${key}`);
}
const compose = readFileSync(join(root, 'static/downloads/docker-compose.yml'));
check(createHash('sha256').update(compose).digest('hex') === checkpoint.composeSha256, 'Downloadable Compose differs from the verified server file');
for (const file of checkpoint.requiredGuides) {
  check(read(file).trim().length > 150, `Missing/incomplete guide ${file}`);
}
const steam = read('docs/server-docs/metadata-enrichment/provider-steam.md');
check(steam.includes('METADATA_STEAM_ENABLED'), 'Steam enable setting is missing');
check(/no.{0,80}API key/i.test(steam.replace(/\s+/g, ' ')), 'Steam account/key requirement is missing');
const auth = read('docs/advanced-usage/authentication.md');
check(auth.includes('/api/auth/oauth2/login') && !auth.includes('/api/auth/oauth2/callback'), 'SSO callback does not match the implemented route');
if (failures.length) throw new Error(failures.join('\n'));
console.log(`Documentation checkpoint verified: ${checkpoint.backendEnvironmentKeys.length} settings, ${checkpoint.requiredGuides.length} guides, canonical Compose and current product names.`);
