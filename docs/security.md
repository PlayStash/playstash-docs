---
sidebar_position: 6
---

# Security checks and maintenance

The frontend and backend repositories run their own dependency/secret checks and
container pipelines. The frontend scans the web image it publishes at
`ghcr.io/playstash/playstash-frontend`; the backend scans its API and PostgreSQL
images at `ghcr.io/playstash/playstash-backend`.

Backend integration checks also resolve the matching published frontend channel
to an immutable digest, scan it, and test the full Compose stack with that image.

The container workflows build and test Linux AMD64 and ARM64 variants. Runtime
vulnerability gates include UNKNOWN, LOW, MEDIUM, HIGH and CRITICAL findings,
without an advisory ignore list or an unfixed-vulnerability exemption. Frontend
publication verifies provenance, architecture manifests and anonymous manifest/blob
access before advancing stable/development tags. Backend publication verifies
anonymous image access before publishing its GitHub release. See
[product builds](advanced-usage/development.md#product-builds)
for the publisher and tag mapping.

Keep the [server updated](server-docs/setup/docker-compose.md#status-updates-and-stopping)
by running `docker compose pull` and `docker compose up -d`, and preserve private
data and backups. Use the current Compose with its separate frontend image.
A previous clean scan is dated evidence; new advisories can change its result.

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

Frontend, backend and documentation source repositories are public, as are the
frontend and backend published releases. The other PlayStash repositories remain
private. Only a main build that passed the build workflow's audit, content and
link checks is deployed to the public documentation website on GitHub Pages.
Hosted checks remain enabled while self-hosted execution defaults to false.

The full product review remains in each product repository. Read
[privacy](privacy.md) for data collection and external connections, and
[authentication](advanced-usage/authentication.md) for operator-controlled keys.
