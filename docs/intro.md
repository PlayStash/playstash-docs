---
sidebar_position: 1
---

# PlayStash documentation

PlayStash is a self-hosted library for organizing, downloading and playing your
DRM-free games. Your server stores games, metadata, users and saves. Browser and
desktop clients connect to that server.

Checked against Backend **17.1.4**, Web/Desktop Frontend **17.2.3** and Windows
application **1.18.1** on **14 October 2026**. All library features are available
without a subscription. Roles, activation, age restrictions and game access apply.

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

| Repository | Purpose |
| --- | --- |
| [playstash-backend](https://github.com/PlayStash/playstash-backend) | API, database, providers and server images |
| [playstash-frontend](https://github.com/PlayStash/playstash-frontend) | Web interface and Windows/Linux/macOS desktop |
| [playstash-app](https://github.com/PlayStash/playstash-app) | Separate Windows application |
| [playstash-docs](https://github.com/PlayStash/playstash-docs) | This documentation |
| [playstash-playnite-integration](https://github.com/PlayStash/playstash-playnite-integration) | Playnite extension |
| [playstash-community-themes](https://github.com/PlayStash/playstash-community-themes) | Windows application themes |
| [playstash-backend-example-plugins](https://github.com/PlayStash/playstash-backend-example-plugins) | Backend plugin examples |

Source repositories and releases remain private. Public container visibility
allows anonymous image downloads independently of source visibility. GitHub
sign-in with repository access is required for private documentation and installers.
Only main and dev are maintained. See [maintenance](advanced-usage/development.md).
