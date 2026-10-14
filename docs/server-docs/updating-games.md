---
sidebar_position: 5
---

# Updating games

Add the new version to `games/` while keeping its title and release-year bucket the same. For example, place `My Game (v1.2.0) (2024).zip` beside `My Game (v1.0.0) (2024).zip`.

After [indexing](indexing.md), the shared game has another downloadable version. Progress, bookmarks and user metadata stay attached to that shared game. The highest-ranked active version becomes the default download; you can keep or remove older versions independently.

A new server file does not modify a desktop installation automatically. The user selects the version and installs it using their client. [Optional patches/mods/DLC](packages.md) are separately selected and applied in the chosen order, with overwrite confirmation in clients that support them.

## Version-aware API

- `GET /api/games/:game_id` returns active `versions[]`.
- `GET /api/game/:game_id/versions/:version_id` downloads the chosen version.
- `GET /api/games/:game_id/download` downloads the server-selected default.

Authenticated access, selected-user restrictions, age restrictions, ranges and bandwidth limits apply to downloads.

## Moving or changing files

A changed file at the same path refreshes its version record. A new path with the same game identity becomes another version; the integrity check removes a stale missing path. If no active versions remain, the game is soft-deleted until a matching package is added again. To create a separate game intentionally, [make its title distinct](adding-games.md#keeping-separate-entries-on-purpose).

Updating the PlayStash **server software** is a different operation; use [the Compose update procedure](setup/docker-compose.md#status-updates-and-stopping).
