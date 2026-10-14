---
sidebar_position: 5.5
---

# Deleting games

Deleting a game version removes its actual files. Make a backup before deleting a package you want to preserve.

## Filesystem removal

Remove the chosen archive from `games/`. If other versions remain, the shared game stays visible. If none remain, the next scan/integrity check soft-deletes the game entity while preserving its associated metadata/progress for a later matching import.

For an unpacked game version, its entire package folder represents that version. This includes related data, `Extras` and `Addons`; review the folder before deleting it.

## Administrator API

`DELETE /api/game/:game_id/versions/:version_id` deletes exactly one version from disk. Only administrators can call it, and demo mode disables the action. The backend must have writable game storage.

Read `versions[]` from `GET /api/games/:game_id` to select the intended version. Other versions remain; the server can choose another default. There is no bulk delete-all-versions endpoint. To remove every version, remove them individually or remove their files from game storage.

Do not delete `data/postgres/`, `data/media/` or other storage directories to remove a game. Those directories contain shared installation data, not just that game's package.
