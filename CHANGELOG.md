# PlayStash documentation changelog

## 1.1.0

### Changes

- The license page and README point to `NOTICE.txt` for the attribution.
- Documented independent frontend and backend container publication, current image repositories/tags, automatic hosted builds, and server updates using Compose pull/up without building source.
- Updated repository/download visibility: frontend and backend sources and published releases are public, including signed Tauri updater feeds; documentation and the other repositories remain private.
- Documented Tauri 17.3.1 local `.ludusavi.yaml` detection in versioned installation folders, save/config examples, opt-in automatic sync and its server prerequisites and detection limits.
- Imported documentation into the private PlayStash documentation repository with synchronized main and dev branches.
- Replaced obsolete branding, subscription requirements, vendor-store links and promotional content with current PlayStash guidance.
- Documented separate frontend/API containers and PostgreSQL in one Compose, first administrator, registration controls, proxies, updates and backups.
- Added the complete reference for all 98 backend configuration variables, their defaults, secret-file support and Compose environment forwarding.
- Added Steam and IGDB setup, refresh/remapping, manual covers and the distinction between backend environment settings and Compose .env interpolation.
- Updated packages, extras/addons, launch profiles, restrictions, saves, requests, reviews, chat and administrator diagnostics.
- Documented Windows/Linux/macOS installers, signed Tauri update channels and access requirements for private Windows-application downloads.
- Added privacy guidance for optional analytics, own-server game metrics, external providers, fonts and logs.
- Added hosted website builds and dependency/secret checks, with self-hosted execution disabled and no automatic public deployment.
- Documentation artifacts are checked for valid links, anchors, local search, original legal notices and the exact published Compose download.
- Patched inherited vulnerable website dependencies and bounded brace-pattern/AST recursion with a pinned, tested local backport where no upstream fixed release exists.
- Preserved source history, original author attribution and the original license.
- Original license and notice bytes remain identical across Windows and Linux checkouts.

### Breaking Changes & Migration

- The frontend container now comes from `ghcr.io/playstash/playstash-frontend`. -> **Update the frontend service's image in an existing Compose file, preserve its local settings and data mounts, then run `docker compose pull` and `docker compose up -d`.**
