---
sidebar_position: 7
---

# Game Indexing

PlayStash keeps your database in sync with your game files.

It watches your files volume (default: `/files`) and updates the index when files are added, changed, or removed. Each detected game archive, single-file executable or supported package folder is stored as its own game version record, while the parent game entry stays stable. You can also trigger a full reindex manually via API.

## When Indexing Runs

Indexing happens in these situations:

- **Automatic file watcher**: reacts to file changes in your library.
- **Scheduled interval scan**: periodic fallback (`GAMES_INDEX_INTERVAL_IN_MINUTES`, default 60 minutes).
- **Manual trigger**: run a full reindex through the API.

## What Happens During Indexing

For each detected game file, PlayStash does the following:

1. Validates the file name and extension.
2. Tries to match the file to an existing game.
3. Stores or restores the file as a normalized **game version** record.
4. Sorts all active versions of that game.
5. Updates the game’s default downloadable version.

### Matching Logic (Simplified)

PlayStash tries these match steps in order:

1. **Exact file path match** → update existing version record.
2. **Soft-deleted match** (path or title/year match) → restore game and update version.
3. **Title + release-year match** → add/update as another version of that game.
4. **No release year in the filename** → prefer an existing same-title no-year bucket first, then fall back to legacy title-only matching.
5. **No match** → create a new game entry.

## How the Default Version Is Chosen

When a game has multiple versions, PlayStash ranks them and uses the highest-ranked one as the default download.

Comparable semantic versions are ranked newest first. Other dotted numeric versions receive a higher comparison score than date-like or less structured numeric labels. For comparable non-semantic labels, the server compares extracted dates/numbers, then prefers stable-looking labels when otherwise equal, then newer `indexed_at` timestamps and a lexical tie-breaker.

The API returns sorted `versions[]`. When a collection has no comparable version tags, the existing preferred file path can remain the default to keep an unversioned library stable; do not infer its chosen default only from import time.

## Integrity Check

After indexing, PlayStash verifies that indexed files still exist on disk.

- Missing version files are removed from the active version list.
- If the previously selected default version disappeared, another remaining version is promoted automatically.
- If a game has no remaining version files, the game is soft-deleted.
- Versions that still belong to already deleted games are cleaned up as well.

## Excluding Files and Folders from Indexing

Use these two settings to skip files/folders during directory-based scans (startup scan, scheduled scans, manual reindex, integrity checks):

- `GAMES_SEARCH_EXCLUDE_FILE_REGEX`: matches against the **file name** only (for example `MyGame Demo.zip`).
- `GAMES_SEARCH_EXCLUDE_DIR_REGEX`: matches against each **directory name** only while scanning recursively (for example `screenshots`).

Patterns use JavaScript `RegExp` syntax.

### Examples

```bash
# Exclude filenames containing sample/demo/trailer
GAMES_SEARCH_EXCLUDE_FILE_REGEX=(sample|demo|trailer)

# Exclude folders like screenshots, trailers, and OST
GAMES_SEARCH_EXCLUDE_DIR_REGEX=^(screenshots|trailers|ost)$

# Example: skip files ending with .soundtrack.zip
GAMES_SEARCH_EXCLUDE_FILE_REGEX=\.soundtrack\.zip$
```

## Client controls and metadata

Use **Administration → Actions → Reindex Games** or administrator `PUT /api/games/reindex` for a full file scan. This is distinct from **Server diagnostics → Refresh all metadata**, which refreshes provider data without rebuilding the file index. See [metadata enrichment](metadata-enrichment/metadata.md).

Folder-tag rules are applied during indexing; [the rule editor](folder-tags.md) can also refresh existing games immediately. Reserved `Extras`/`Addons` sidecars are not indexed as games. Nested links are rejected, and unpacked payloads are validated before/after generating a download archive. On network shares, enable `GAMES_INDEX_USE_POLLING` if native events do not arrive.
