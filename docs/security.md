---
sidebar_position: 6
---

# Security checks and maintenance

Product release pipelines audit dependencies, scan secrets and test the actual
runtime images. Backend 17.1.4 main/dev publication produced twelve zero-finding
image reports on 14 October 2026: three images on AMD64/ARM64 for both branches.
Keep the [server updated](server-docs/setup/docker-compose.md) and preserve
private data and backups. New advisories can change a dated result.

The documentation build also audits production and development dependencies at
all severities. Inherited website packages were updated without advisory ignores.
The brace-pattern dependency had no upstream patched release for
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
The local MIT-licensed backport bounds parser/AST complexity, rejects cycles and
is tested against pinned original source, stack-exhaustion reproductions and
ordinary patterns. A clean registry audit alone does not establish that the
backport is correct; its regression and production build checks run in CI too.

Secret scanning covers inherited Git history and current source. Four exact
immutable historical findings are documented truncated JWT examples ending in
an ellipsis, excluded by commit/path/rule/line fingerprints. No real credentials
or future findings are excluded by that exception.

Source stays private. Website builds are private Actions artifacts; there is no
automatic public documentation deployment. Hosted checks remain enabled while
self-hosted execution defaults to false.

The full product review remains in each product repository. Read
[privacy](privacy.md) for data collection and external connections, and
[authentication](advanced-usage/authentication.md) for operator-controlled keys.
