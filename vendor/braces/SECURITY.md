# Local braces security backport

This private package is a fork of **braces 3.0.3**, not an official patched
release. The original MIT license and author remain intact. `PROVENANCE.json`
records the original tarball integrity, file hashes and affected advisory.

[CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
has no official patched release as checked on 14 October 2026. Deeply nested
patterns produce an AST whose recursive compile, expand and stringify walkers
exhaust the JavaScript stack. Docusaurus reaches this package through micromatch
and chokidar.

The local patch rejects structural nesting before the parser builds a dangerous
AST. Each recursive walk also validates caller-supplied ASTs iteratively:
at most 256 node levels and 65,536 visited nodes, with child-node cycles rejected.
Normal `parent` and `prev` backlinks remain valid. These bounds are fixed and
cannot be raised by caller options. Invalid complexity throws a controlled
`SyntaxError` with code `ERR_BRACES_COMPLEXITY`.

Only `lib/parse.js`, `lib/compile.js`, `lib/expand.js` and `lib/stringify.js`
change, plus the new `lib/depth-guard.js`. Other source files are unchanged.
`scripts/check-braces-security.mjs` verifies the original source fixture hashes,
demonstrates stack exhaustion in unmodified upstream walkers, exercises the
installed transitive fork against the same inputs, tests direct AST bypasses,
and compares ordinary glob/range behavior with upstream. The production
Docusaurus build verifies compatibility with this dependency tree.

The dependency audit includes the fork's transitive dependencies. No advisory
IDs or severities are ignored. A clean registry audit alone does not validate
this fork; the separate source and regression checks are required in CI.
Replace this local backport with an official fixed release once available.
