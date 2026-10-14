---
title: Themes
sidebar_position: 5
---

Theme controls differ between the browser/Tauri frontend and the WPF Windows
application. All provided theme features are available without a subscription.

## Browser and cross-platform desktop

Open `Settings → Appearance → Theme` and choose `System`, `Light` or `Dark`.
`System` follows the device's color-scheme preference. The choice is saved locally
and does not change other users' interfaces.

The current frontend does not import WPF XAML community themes or provide the
WPF palette generator. Its `Appearance` controls also include interface language,
zoom and `Streamer / OPSEC Mode`; masking displayed details does not change
server-side permissions or what authenticated requests contain.

## Windows application

Open `Settings → Application → Theme`. Choose from `Installed Themes`.
Use `Open Theme Folder` to open the active profile's import directory, and
`Reload Theme List` after adding a theme. Theme imports belong to that WPF profile,
not to the backend or the Tauri application.

The [community theme repository](https://github.com/PlayStash/playstash-community-themes)
is private. An anonymous in-app community list may therefore be unavailable.
Download accessible themes while signed in to GitHub, put their XAML files and
required local images in the profile's theme directory, reload the list and select
the theme. The folder is under the profile's
`%APPDATA%\PlayStash\profiles/<server-key>/<profile-id>/themes/` path.

## Custom themes

The WPF application provides `Settings → Application → Create a Theme`:

1. Enter a name and choose the main color.
2. Select `Generate`, then adjust background, panel, text and border colors.
3. Optionally choose `Choose Optional Overlay Image`.
4. Choose `Export Theme`, keep the exported image beside the XAML when present,
   then import through the profile's theme folder.

### Schema 1 and schema 2

Schema 1 themes define the theme metadata and ten PlayStash colors. Schema 2
supports the same colors plus an optional local overlay image. The importer reads
theme data only; arbitrary XAML objects, markup extensions, merged dictionaries,
remote image URLs and filesystem links are rejected.

Required metadata includes `Theme.SchemaVersion`, `Theme.Name`,
`Theme.DisplayName`, `Theme.Description` and `Theme.Author`. The supported colors
are:

| Resource prefix `PlayStash.Colors.` | Purpose |
| --- | --- |
| `Foreground`, `Foreground2` | Text colors |
| `Background`, `Background2` | Background and panel colors |
| `Accent`, `Accent2`, `Accent3`, `Accent4` | Accent colors |
| `Border` | Borders |
| `Blur` | Blur/background effect color |

A schema 2 theme can include a relative overlay resource, for example this excerpt:

```xml
<BitmapImage x:Key="PlayStash.Images.Overlay" UriSource="overlay.png" />
```

Use PNG, JPEG, BMP or GIF and keep it with the theme. Theme text is limited to
64 KiB of characters; images are limited to 16 MiB, 128 frames and 16 million
pixels across all frames. These limits also apply to generated/imported overlays.
The generator is the easiest way to produce a complete compatible theme.

See [Data management](./data.md) for the profile layout. WPF themes do not style
the browser, Tauri interface or server API.
