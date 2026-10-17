---
sidebar_position: 7
---

# Development, releases and documentation maintenance

## Branches and hosted jobs

All seven repositories maintain main and dev, with main as default. Frontend and
backend sources are public; documentation and the other repositories remain
private. Published documentation changes synchronize both branches. GHCR package
visibility is configured separately from source repository visibility.

Hosted tests, builds and installers run on their declared triggers.
PLAYSTASH_RUN_SELF_HOSTED=false affects only explicitly gated self-hosted jobs.
Current jobs use hosted runners. Configure the variable in
Settings → Secrets and variables → Actions → Variables.

## Product builds

Container publication belongs to the repository that owns the application:

| Repository | Published images | Stable / development tags |
| --- | --- | --- |
| `playstash-frontend` | `ghcr.io/playstash/playstash-frontend` | `latest` / `dev` |
| `playstash-backend` | `ghcr.io/playstash/playstash-backend` API and initializer | `latest` / `dev` |
| `playstash-backend` | PostgreSQL in its backend image package | `postgres16` / `postgres16-dev` |

Both repositories build automatically on main and dev pushes, matching `v*`
version tags, and manual workflow dispatch. The jobs use GitHub-hosted runners.
The frontend web-image pipeline is independent of native desktop packaging; a
new successful frontend main build can update the browser interface without a
backend release. Each image also has immutable version tags, for example
frontend `v17.3.2`, backend `v17.1.5` and PostgreSQL `postgres16-v17.1.5`.

Both AMD64 and ARM64 images are tested and scanned. Frontend checks cover the
web build, its Nginx runtime and proxy behavior; backend checks cover the API,
PostgreSQL, persistent storage and Compose operation. Frontend publication verifies
source/version provenance, architecture manifests and anonymous downloads before
advancing stable or development channels. Backend publication checks anonymous
downloads after creating its image tags and before publishing a GitHub release.
See [security checks](../security.md)
for the dependency and runtime scan policy.

Backend integration CI resolves the matching published frontend channel to one
multiarch digest and tests the complete Compose deployment against that exact
image. Stable backend builds use the frontend's `latest` channel; development
builds use `dev`. The frontend remains published by its own workflow.

Frontend main/version builds produce Windows x64, Linux x64 and macOS Intel/
Apple-Silicon installers. A complete platform matrix and signed updater feeds
precede stable publication. Dev builds have unique unstable versions.
The frontend's published releases and signed updater feeds are public and can
be read without GitHub sign-in.

The separate Windows app builds its own self-contained installer/ZIP, with
checked save-tool provenance and supported .NET runtime.

Increase the version fields required by the product repository to publish new
immutable release assets. Same-version pushes continue automatic hosted checks
and builds while preserving published version tags/assets. Main/dev container
channels follow their latest successfully checked source builds.

The server operator uses the [current Compose file](../server-docs/setup/docker-compose.md)
and runs `docker compose pull` followed by `docker compose up -d`. The machine
running the library downloads images; it does not compile either repository.

## Keep documentation current

Read the implementation before changing an environment name, default, endpoint,
UI instruction or client capability. Update affected pages and CHANGELOG.md.
Keep downloadable Compose identical to the supported backend Compose.

For new product releases review install, configuration, providers, privacy,
security and clients, and update the verified version checkpoint.
Historical issue/branch reports are evidence, not current install instructions.

Run frozen installation, content checks, full audit, secret scan and production
Docusaurus build with broken links treated as errors. Main/dev upload website
artifacts. Main deploys its checked build to GitHub Pages through Actions; no
extra hosting branch is used.

## Verified checkpoint

The deployment checkpoint records the source commits, versions and image
repositories reviewed for the independent frontend/backend publication model.
The downloadable Compose has a recorded SHA-256 and is checked against that
checkpoint during documentation builds.

The complete feature/UI review was performed on 14 October 2026; later focused
reviews cover the Tauri 17.3.1 game-local save manifest and the independent image
deployment. These focused updates do not claim a fresh review of every client
screen or feature. `source-checkpoint.json` retains the per-scope versions and
dates. Runtime scan results are dated evidence; current workflow reports provide
the result for each newly built or published image.
