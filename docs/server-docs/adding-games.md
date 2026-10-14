---
sidebar_position: 3
sidebar_title: Adding Games
---

# Adding games

Place your DRM-free game files into the host `games/` folder beside the Compose file. Read [file/folder structure](structure.md) before naming and grouping your games.

## Prepare an archive or folder

An existing ZIP/7z archive can be imported as it is. Keep installers and their related `.bin`/data files together. You can archive them yourself or use [an unpacked game folder with an optional package manifest](packages.md). Archiving is not mandatory for supported folder games.

For an archive, a useful filename is:

```text
My Game (v1.2.0) (2024).zip
```

The type is detected from its contents, or use [a type override](game-types.md) when detection is unsuitable. The backend only indexes and serves files; it does not run game installers.

## Keeping multiple versions of the same game

These files become versions of one shared game:

```text
My Game (v1.0.0) (2024).zip
My Game (v1.2.0) (2024).7z
```

Same-title files without year tags share a no-year bucket. Progress, bookmarks and metadata belong to the shared game entity. The server ranks the active versions and selects a default download.

## Keeping separate entries on purpose

Use distinct titles for intentionally separate editions or modpacks. Square brackets remain part of the title:

```text
My Game [Original] (v1.2.0) (2024).zip
My Game [Community Modpack] (v1.2.0) (2024).zip
```

## Add files or upload

Copy your finished archive/folder into `games/`, using an account permitted to write the backend's storage. Let copying finish before indexing; a partially written file is not a complete game package. The watcher and periodic scan normally pick up changes. In **Administration → Actions → Reindex Games**, an administrator can request an immediate full scan.

Administrators can also upload one supported game file through the client or `POST /api/games` with multipart field `file`. Uploads stream to temporary disk storage. The backend needs writable `VOLUMES_FILES`; `GAMES_MAX_UPLOAD_SIZE` defaults to `100gb`. A value of `0` removes the application upload-size limit; it does **not** turn uploads off. Align the outer proxy's limit and available disk space with your chosen limit.

Enable [Steam or IGDB](metadata-enrichment/metadata.md) if you want remote descriptions and artwork. With no active provider, your files can still be indexed and metadata/images can be entered manually. See [folder tags](folder-tags.md) to categorize imports automatically.
