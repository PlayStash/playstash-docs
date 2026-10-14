import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const build = path.join(repo, "build");
const require = createRequire(import.meta.url);
const config = require(path.join(repo, "docusaurus.config.js"));
const searchRequire = createRequire(require.resolve("@cmfcmf/docusaurus-search-local/package.json"));
const { load } = searchRequire("cheerio");
const checkpoint = JSON.parse(readFileSync(path.join(repo, "source-checkpoint.json"), "utf8"));
const hash = file => createHash("sha256").update(readFileSync(file)).digest("hex");
const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
const origin = new URL(config.url).origin;
const htmlCache = new Map();
const publicPath = file => config.baseUrl + path.relative(build, file).split(path.sep).join("/").replace(/index\.html$/, "");

function html(file) {
  if (!htmlCache.has(file)) htmlCache.set(file, load(readFileSync(file, "utf8")));
  return htmlCache.get(file);
}

function targetFile(url) {
  assert.ok(url.pathname.startsWith(config.baseUrl), `URL escapes configured base path: ${url.pathname}`);
  const relative = decodeURIComponent(url.pathname.slice(config.baseUrl.length));
  const candidate = path.resolve(build, relative);
  assert.ok(candidate === build || candidate.startsWith(build + path.sep), `URL escapes build directory: ${url.pathname}`);
  for (const file of [candidate, path.join(candidate, "index.html"), candidate + ".html"]) {
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  throw new Error(`Rendered URL has no artifact file: ${url.pathname}`);
}

let links = 0;
let resources = 0;
function verifyUrl(value, sourceUrl, resource) {
  if (!value || value.startsWith("data:")) return;
  const url = new URL(value, sourceUrl);
  if (url.origin !== origin) {
    assert.ok(!resource, `Unexpected remote runtime resource: ${url.href}`);
    return;
  }
  const file = targetFile(url);
  if (url.hash && file.endsWith(".html")) {
    const target = html(file);
    const id = decodeURIComponent(url.hash.slice(1));
    const ids = new Set(target("[id], a[name]").toArray().map(element => target(element).attr("id") || target(element).attr("name")));
    assert.ok(ids.has(id), `Rendered anchor is missing: ${url.href}`);
  }
  if (resource) resources++;
  else links++;
}

assert.equal(config.onBrokenLinks, "throw");
assert.equal(config.onBrokenAnchors, "throw");
assert.equal(config.markdown.hooks.onBrokenMarkdownLinks, "throw");
const htmlFiles = files(build).filter(file => file.endsWith(".html"));
assert.ok(htmlFiles.length > 20, "Documentation build is incomplete");
for (const file of htmlFiles) {
  const document = html(file);
  const sourceUrl = new URL(publicPath(file), origin);
  assert.ok(document("title").text().includes("PlayStash"));
  for (const element of document("[href], [src], [poster]").toArray()) {
    const node = document(element);
    const tag = element.tagName.toLowerCase();
    const rel = (node.attr("rel") || "").toLowerCase();
    if (node.attr("href")) {
      const resource = tag === "link" && /stylesheet|icon|preload|prefetch|preconnect|dns-prefetch/.test(rel);
      verifyUrl(node.attr("href"), sourceUrl, resource);
    }
    for (const attribute of ["src", "poster"]) {
      if (node.attr(attribute)) verifyUrl(node.attr(attribute), sourceUrl, true);
    }
  }
}
for (const file of files(build).filter(file => file.endsWith(".css"))) {
  const sourceUrl = new URL(publicPath(file), origin);
  for (const match of readFileSync(file, "utf8").matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    verifyUrl(match[1], sourceUrl, true);
  }
}

assert.equal(hash(path.join(build, "downloads", "docker-compose.yml")), checkpoint.composeSha256);
for (const legal of ["LICENSE", "NOTICE.txt"]) assert.equal(hash(path.join(build, legal)), hash(path.join(repo, legal)));
assert.equal(hash(path.join(build, "licenses", "braces-LICENSE")), hash(path.join(repo, "vendor", "braces", "LICENSE")));
const intro = html(path.join(build, "docs", "intro", "index.html"));
for (const resource of ["downloads/docker-compose.yml", "LICENSE", "NOTICE.txt"]) {
  assert.ok(intro(`a[href="${config.baseUrl}${resource}"]`).length, `Missing direct file link: ${resource}`);
}
const searchFiles = files(build).filter(file => /search-index.*\.json$/.test(path.basename(file)));
assert.equal(searchFiles.length, 1, "Expected one local documentation search index");
const search = JSON.parse(readFileSync(searchFiles[0], "utf8"));
assert.ok(search.documents.length > 20);
for (const document of search.documents) {
  assert.equal(document.type, "docs");
  verifyUrl(document.sectionRoute, new URL(config.baseUrl, origin), false);
}
assert.ok(search.documents.some(document => /Steam/.test(document.pageTitle)), "Steam guide is missing from local search");
assert.ok(search.documents.some(document => /IGDB/.test(document.pageTitle)), "IGDB guide is missing from local search");
console.log(`Built documentation verified: ${htmlFiles.length} HTML pages, ${links} local links/search entries, ${resources} local resources, ${search.documents.length} searchable sections, canonical Compose and license files.`);
