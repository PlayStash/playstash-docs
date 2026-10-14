import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const local = path.join(repo, "vendor", "braces");
const provenance = JSON.parse(readFileSync(path.join(local, "PROVENANCE.json"), "utf8"));
const fixture = readFileSync(path.join(repo, "scripts", "fixtures", "braces-3.0.3.tgz"));
const digest = input => createHash("sha256").update(input).digest("hex");
assert.equal(digest(fixture), "1cd18e862c8640b4568b1425a7df4ee030ff201d45b2da8f9f222d2987494ffc");
assert.equal(digest(fixture), provenance.tarballSha256);
assert.equal(`sha512-${createHash("sha512").update(fixture).digest("base64")}`, provenance.upstreamIntegrity);

const baselineDir = mkdtempSync(path.join(tmpdir(), "playstash-braces-baseline-"));
assert.equal(path.dirname(path.resolve(baselineDir)), path.resolve(tmpdir()));
assert.ok(path.basename(baselineDir).startsWith("playstash-braces-baseline-"));
const archive = gunzipSync(fixture, { maxOutputLength: 128 * 1024 });
const originalFiles = new Set();
for (let offset = 0; offset + 512 <= archive.length;) {
  const header = archive.subarray(offset, offset + 512);
  if (header.every(byte => byte === 0)) break;
  const name = header.subarray(0, 100).toString().split("\0")[0];
  const size = Number.parseInt(header.subarray(124, 136).toString().replaceAll("\0", "").trim(), 8);
  assert.ok(Number.isInteger(size) && size >= 0 && size <= 64 * 1024);
  assert.equal(header[156], "0".charCodeAt(0));
  assert.ok(name.startsWith("package/"));
  const relative = name.slice("package/".length);
  assert.ok(Object.hasOwn(provenance.originalFiles, relative), `Unexpected original file ${name}`);
  assert.ok(!originalFiles.has(relative), `Duplicate original file ${name}`);
  const contents = archive.subarray(offset + 512, offset + 512 + size);
  assert.equal(digest(contents), provenance.originalFiles[relative]);
  const target = path.join(baselineDir, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, contents);
  originalFiles.add(relative);
  offset += 512 + Math.ceil(size / 512) * 512;
}
assert.equal(originalFiles.size, Object.keys(provenance.originalFiles).length);
after(() => rmSync(baselineDir, { recursive: true, force: true }));

const appRequire = createRequire(import.meta.url);
const coreRequire = createRequire(appRequire.resolve("@docusaurus/core/package.json"));
const utilsRequire = createRequire(coreRequire.resolve("@docusaurus/utils/package.json"));
const micromatchRequire = createRequire(utilsRequire.resolve("micromatch"));
const installedEntry = micromatchRequire.resolve("braces");
const installedRequire = createRequire(installedEntry);
const installedPackage = JSON.parse(readFileSync(path.join(path.dirname(installedEntry), "package.json"), "utf8"));
assert.equal(installedPackage.name, "@playstash/braces");
assert.equal(installedPackage.version, "3.0.3-playstash.1");
const patched = installedRequire(installedEntry);
const fillRangeModules = path.dirname(path.dirname(installedRequire.resolve("fill-range/package.json")));

// Execute the unmodified upstream package in a separate process. Its original
// source bytes above are verified independently of the local security patch.
const baselineRun = (operation, inputKind) => JSON.parse(execFileSync(process.execPath, [
  "--eval",
  `const braces = require(process.argv[1]);
   const operation = process.argv[2];
   const kind = process.argv[3];
   const input = kind === 'deep'
     ? '{'.repeat(4999) + 'x' + '}'.repeat(4999)
     : kind === 'deep-ast'
       ? (() => { let ast = { type: 'text', value: 'x', nodes: [] };
           for (let i = 0; i < 10000; i++) ast = { type: 'root', nodes: [ast] };
           return ast; })()
       : JSON.parse(kind);
   try {
     console.log(JSON.stringify({ value: braces[operation](input.pattern || input, input.options || {}) }));
   } catch (error) {
     console.log(JSON.stringify({ error: { name: error.name, message: error.message } }));
   }`,
  path.join(baselineDir, "index.js"), operation, inputKind,
], { encoding: "utf8", timeout: 5000, env: { ...process.env, NODE_PATH: fillRangeModules } }));

const guarded = error => error instanceof SyntaxError && error.code === "ERR_BRACES_COMPLEXITY";

test("original source and unchanged license are pinned", () => {
  for (const relative of ["index.js", "lib/constants.js", "lib/utils.js", "LICENSE"]) {
    assert.equal(digest(readFileSync(path.join(local, relative))), provenance.originalFiles[relative]);
  }
});

for (const operation of ["compile", "expand", "stringify"]) {
  test(`unmodified upstream ${operation} exhausts the stack on nested ${operation === "expand" ? "patterns" : "caller ASTs"}`, () => {
    const result = baselineRun(operation, operation === "expand" ? "deep" : "deep-ast");
    assert.equal(result.error?.name, "RangeError");
    assert.match(result.error.message, /maximum call stack/i);
  });
  test(`installed transitive ${operation} rejects excessive pattern nesting safely`, () => {
    const pattern = "{".repeat(4999) + "x" + "}".repeat(4999);
    assert.throws(() => patched[operation](pattern, { maxDepth: Infinity }), guarded);
  });
  test(`${operation} also rejects deep caller-supplied ASTs`, () => {
    let ast = { type: "text", value: "x", nodes: [] };
    for (let depth = 0; depth < 10000; depth++) ast = { type: "root", nodes: [ast] };
    assert.throws(() => patched[operation](ast), guarded);
  });
  test(`${operation} rejects nodes cycles while accepting parser parent links`, () => {
    const cyclic = { type: "root", nodes: [] };
    cyclic.nodes.push(cyclic);
    assert.throws(() => patched[operation](cyclic), guarded);
    assert.doesNotThrow(() => patched[operation](patched.parse("{a,b}")));
  });
  test(`${operation} bounds huge caller-supplied node lists`, () => {
    const wide = { type: "root", nodes: Array.from({ length: 65537 }, () => ({ type: "text", value: "x", nodes: [] })) };
    assert.throws(() => patched[operation](wide), guarded);
  });
}

test("parser guards balanced and unclosed braces and parentheses before building unsafe ASTs", () => {
  for (const [open, close] of [["{", "}"], ["(", ")"]]) {
    assert.throws(() => patched.parse(open.repeat(4999) + "x" + close.repeat(4999)), guarded);
    assert.throws(() => patched.parse(open.repeat(4999) + "x"), guarded);
  }
  assert.doesNotThrow(() => patched.compile("{".repeat(200) + "x" + "}".repeat(200)));
});

for (const sample of [
  { pattern: "docs/**/*.{md,mdx}" },
  { pattern: "foo/{a,b}/bar" },
  { pattern: "file-{01..03}.md" },
  { pattern: "{a,{b,c}}" },
  { pattern: "{a,b}{1,2}" },
  { pattern: "{1..5..2}" },
  { pattern: "${literal}" },
  { pattern: "\\{a,b\\}" },
  { pattern: "\"{a,b}\"", options: { keepQuotes: true } },
  { pattern: "[{}]" },
  { pattern: "a/{b,c" },
]) {
  test(`ordinary compile/expand/stringify behavior matches upstream: ${sample.pattern}`, () => {
    for (const operation of ["compile", "expand", "stringify"]) {
      const original = baselineRun(operation, JSON.stringify(sample));
      assert.equal(original.error, undefined);
      assert.deepEqual(patched[operation](sample.pattern, sample.options), original.value);
    }
  });
}

test("literal, escaped, quoted and bracketed braces do not count as structural nesting", () => {
  for (const pattern of ["a".repeat(9000), "\\{".repeat(4000), `"${"{".repeat(9000)}"`, `[${"{".repeat(9000)}]`]) {
    assert.doesNotThrow(() => patched.compile(pattern));
  }
});
