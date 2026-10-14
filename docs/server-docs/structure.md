---
sidebar_position: 2.5
---

# File and folder structure

The supplied Compose mounts the host's `games/` directory into the backend at `/files`. You can use existing archives, single-file executables, or supported unpacked folders with their related data files. The frontend never mounts your library.

## Supported archive formats

The backend's default indexer accepts these extensions:

`.7z` `.xz` `.bz2` `.gz` `.tar` `.zip` `.wim` `.ar` `.arj` `.cab` `.chm` `.cpio` `.cramfs` `.dmg` `.ext` `.fat` `.gpt` `.hfs` `.ihex` `.iso` `.lzh` `.lzma` `.mbr` `.msi` `.nsis` `.ntfs` `.qcow2` `.rar` `.rpm` `.squashfs` `.udf` `.uefi` `.vdi` `.vhd` `.vmdk` `.xar` `.z`

Override the list with `GAMES_SUPPORTED_FILE_FORMATS` if needed. These are **server indexing** formats. Installation/extraction depends on the client and its available codecs; use ZIP or 7z when preparing broadly compatible packages. The browser interface can download a game, while local installation is performed by a desktop client.

## Single-file executables

`.exe`, `.sh` and `.appimage` are supported. The server wraps a single executable in an uncompressed TAR when downloaded so a client receives a consistent package. The server does not execute it. An `.exe` defaults to Windows Setup unless you supply a portable override; `.sh` and `.appimage` default to Linux Portable.

## Unpacked game folders

A folder containing a recognized setup/install executable or a `playstash-package.json` manifest is indexed as one game. Use a manifest for portable folders, explicit titles/versions, installation recipes, launch profiles and sidecars. See [packages, extras and addons](packages.md) for the full format.

```text
games/
  Classics/
    My Game (v1.2) (2024).zip
  My Other Game (v2.0)/
    playstash-package.json
    setup.exe
    data1.bin
    Extras/
      Manual.pdf
    Addons/
      Patch.zip
```

`Extras` and `Addons` are reserved case-insensitive sidecar directories. Their files do not appear as independent games and are excluded from the generated main folder download.

## Naming convention

```text
Title (vVersion) (EA) (GameType) (NC) (ReleaseYear).zip
```

Only the title is required. The flags and version prefix are case-sensitive:

| Element | Meaning | Example |
| --- | --- | --- |
| Title | Display/search identity, with all parenthesized parts removed | `My Game [Deluxe]` |
| Version | Optional version beginning with lowercase `v` | `(v1.2.0)` |
| Early access | Early-access marker | `(EA)` |
| Game type | Explicit [type](game-types.md) | `(W_S)`, `(W_P)`, `(W_SW)`, `(L_P)`, `(L_SW)` |
| No cache | Suppress external provider metadata updates | `(NC)` |
| Release year | Distinguish same-title releases | `(2024)` |

A `(NC)` marker on any version path suppresses provider updates for the whole shared game. Parentheses are reserved for these flags; use square brackets for meaningful edition/modpack names. For example, `My Game [Community Modpack] (v1.2) (2024).zip` has a distinct title.

Files sharing a title and release-year bucket become downloadable versions of one game. Same-title files without a year share a no-year bucket. See [adding games](adding-games.md) and [indexing](indexing.md) for identity and ordering.

Use portable filenames: avoid `/`, `<`, `>`, `:`, double quotes, backslashes, `|`, `?`, `*`, reserved Windows device names, and trailing dots/spaces. For compound archives, use a name whose final extension is supported; a simple ZIP/7z avoids title suffix ambiguity.

## Additional disks

Mount additional ordinary directories below `/files` in the **backend** service. Preserve the standard storage mounts:

```yaml
services:
  playstash-backend:
    volumes:
      # Add this beside the existing ./games:/files and other mounts.
      - /mnt/disk2/games:/files/disk2
```

Leave `GAMES_SEARCH_RECURSIVE=true` to scan those subdirectories. The backend account must have the intended read/write access. Bind mounts are supported; symlinks/junctions inside the game storage are rejected. Do not use the former symlink-based multi-disk workaround.
