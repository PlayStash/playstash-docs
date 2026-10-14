---
sidebar_position: 7
---

# Development, releases and documentation maintenance

## Branches and hosted jobs

All seven repositories are private and maintain main and dev, with main as
default. Published documentation changes synchronize both branches.
Public GHCR downloads are independent of private source visibility.

Hosted tests, builds and installers run on their declared triggers.
PLAYSTASH_RUN_SELF_HOSTED=false affects only explicitly gated self-hosted jobs.
Current jobs use hosted runners. Configure the variable in
Settings → Secrets and variables → Actions → Variables.

## Product builds

Backend pushes coordinate separate frontend, backend and PostgreSQL images.
The frontend is pinned to a verified release; frontend-only pushes do not alter
an already published server release. Before publication, CI verifies hashes,
licenses, all three images on both architectures, complete Compose operation
and anonymous image downloads.

Frontend main/version builds produce Windows x64, Linux x64 and macOS Intel/
Apple-Silicon installers. A complete platform matrix and signed updater feeds
precede stable publication. Dev builds have unique unstable versions.
Private feeds cannot be read by the anonymous updater.

The separate Windows app builds its own self-contained installer/ZIP, with
checked save-tool provenance and supported .NET runtime.

Increase the version fields required by the product repository to publish new
immutable assets. Pushes with the same published version create Actions artifacts
without overwriting release assets.

## Keep documentation current

Read the implementation before changing an environment name, default, endpoint,
UI instruction or client capability. Update affected pages and CHANGELOG.md.
Keep downloadable Compose identical to the supported backend Compose.

For new product releases review install, configuration, providers, privacy,
security and clients, and update the verified version checkpoint.
Historical issue/branch reports are evidence, not current install instructions.

Run frozen installation, content checks, full audit, secret scan and production
Docusaurus build with broken links treated as errors. Main/dev upload private
website artifacts. No public deployment or extra hosting branch is configured.

## Verified checkpoint

Backend 17.1.4 and Frontend 17.2.3 release workflows passed on both branches.
The server's twelve image reports (three images, two architectures, both branches)
found zero known vulnerabilities at every scanned severity on 14 October 2026.
New advisories can change that dated result; workflow gates continue checking
actual built and published images.
