---
sidebar_position: 1
---

# PlayStash documentation

PlayStash is a self-hosted library for organizing, downloading and playing your
DRM-free games. Your server stores games, metadata, users and saves. Browser and
desktop clients connect to that server.

Current deployment examples use Backend **17.1.5** and Frontend **17.3.2**, with
independently published frontend and backend images. The [verification
checkpoint](advanced-usage/development.md#verified-checkpoint) distinguishes the
deployment review from earlier client-feature reviews. All library features are
available without a subscription. Roles, activation, age restrictions and game
access apply.

## Start here

1. [Install the server](server-docs/setup/setup.md): one Compose, separate frontend,
   API and PostgreSQL, public prebuilt images.
2. [Create the first administrator](server-docs/user-management.md) and
   [add games](server-docs/adding-games.md).
3. [Enable Steam or IGDB](server-docs/metadata-enrichment/metadata.md) for metadata.
4. [Connect a client](client-docs/setup.md).
5. Configure [backups](server-docs/backup-and-restore.md) and read
   [privacy and external services](privacy.md).

## Repositories

| Repository | Visibility | Purpose |
| --- | --- | --- |
| [playstash-backend](https://github.com/PlayStash/playstash-backend) | Public | API, database, providers and API/PostgreSQL images |
| [playstash-frontend](https://github.com/PlayStash/playstash-frontend) | Public | Web image, web interface and Windows/Linux/macOS desktop |
| [playstash-app](https://github.com/PlayStash/playstash-app) | Private | Separate Windows application |
| [playstash-docs](https://github.com/PlayStash/playstash-docs) | Private | This documentation |
| [playstash-playnite-integration](https://github.com/PlayStash/playstash-playnite-integration) | Private | Playnite extension |
| [playstash-community-themes](https://github.com/PlayStash/playstash-community-themes) | Private | Windows application themes |
| [playstash-backend-example-plugins](https://github.com/PlayStash/playstash-backend-example-plugins) | Private | Backend plugin examples |

Frontend and backend sources and published releases are public. Their GHCR
packages also allow anonymous image downloads. The documentation and other
repositories remain private; GitHub sign-in with repository access is required
for their contents and release assets, including the separate Windows application.
Only main and dev are maintained. See [maintenance](advanced-usage/development.md).
