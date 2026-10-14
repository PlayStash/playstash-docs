---
title: Data management
sidebar_position: 4
---

Server data and local client data are separate. Games, accounts, provider metadata,
shared images and uploaded save versions live on your server. Client settings,
caches, authentication state and installed games live on your computer. See
[Server persistence](../server-docs/configuration.md) and [Privacy](../privacy.md)
for server configuration and information exchange.

## Browser sessions

The browser keeps interface preferences, cached user information and session
persistence in storage for the instance's origin. Persistent refresh tokens use
browser local storage. Clearing that site's data removes local preferences and
can require another login; it does not delete server accounts, games or saves.

Direct downloads use the browser's download directory. The browser does not
create the native PlayStash game-root layout.

## Cross-platform desktop client

The Tauri application's identifier is `com.playstash.playstash`. Its native
application-data directory follows the operating system's standard directories:

| Platform | Default application-data location |
| --- | --- |
| Windows | `%APPDATA%\com.playstash.playstash` |
| Linux | `$XDG_DATA_HOME/com.playstash.playstash`, normally `~/.local/share/com.playstash.playstash` |
| macOS | `~/Library/Application Support/com.playstash.playstash` |

Native settings such as startup behavior, ignored executables, compatibility
preferences and the post-install script are stored in `playstash-settings.json`.
Other interface preferences, including download roots, theme, language and update
channel, are kept in the webview's local storage. These are separate stores; the
JSON file alone is not a full settings backup.

### Authentication

Native refresh tokens are stored in the encrypted `vault.hold` Stronghold vault,
not in webview local storage. Its automatic-unlock password is a separate private
`vault-password` file in the application-local-data directory. On Windows that
can be under `%LOCALAPPDATA%\com.playstash.playstash`, distinct from `%APPDATA%`.
Protect both locations when backing up client state. If vault persistence fails,
the app keeps the current session in memory rather than silently saving the token
as plaintext.

### Offline cache

`offline-cache/` in the application-data directory contains cached game JSON and
images used for offline browsing of downloaded or installed games. Image caching
is separated by server namespace. It is a cache, not a server database backup.
A server connection is still needed for current provider data, chat, new library
items and save uploads.

### Downloaded and installed games

Game files live under the download locations you selected, outside the normal
application-data directory:

```text
<Root>/PlayStash/<Title>/.playstash.metadata.json
<Root>/PlayStash/<Title>/Versions/<Version>/.playstash.game.config.json
<Root>/PlayStash/<Title>/Versions/<Version>/Download/
<Root>/PlayStash/<Title>/Versions/<Version>/Extraction/
<Root>/PlayStash/<Title>/Versions/<Version>/Installation/
```

The generated metadata and version configuration identify local installations
and launch options. Keep them with the game when moving or backing it up. Shared
archive passwords can be part of cached game metadata, so treat that metadata as
private rather than publishing the complete folder as a generic template.

The Linux compatibility prefix base is separately configurable under
`Settings → Games → Wine/Proton Prefix Directory`. Its default is
`$XDG_DATA_HOME/PlayStash/prefixes`, normally `~/.local/share/PlayStash/prefixes`.
A prefix can contain game saves and Windows configuration; it is not merely a
replaceable image cache.

### Logs

`Settings → Games → Launch logs` provides access to native launch diagnostics.
Launch and tracker logs use the platform's application-log directory. Developer
Tools offers optional verbose diagnostics; keep it off unless you need that
additional troubleshooting detail. Review log contents before sharing them.

## Windows application profiles

The WPF application uses `%APPDATA%\PlayStash`, independently of Tauri:

| Path below `%APPDATA%\PlayStash` | Purpose |
| --- | --- |
| `profileconfig` | Profile chooser configuration |
| `profiles/<server-key>/ImageCache/` | Shared image cache for that server |
| `profiles/<server-key>/<profile-id>/config/user` | That profile's account and client preferences |
| `profiles/<server-key>/<profile-id>/config/web/` | Embedded browser state for authentication flows |
| `profiles/<server-key>/<profile-id>/config/cloudsave/` | Local save-tool configuration |
| `profiles/<server-key>/<profile-id>/cache/prgs` | Pending offline progress |
| `profiles/<server-key>/<profile-id>/cache/local` | Locally cached game metadata |
| `profiles/<server-key>/<profile-id>/cache/ignorelist` | Executables ignored by local tracking |
| `profiles/<server-key>/<profile-id>/themes/` | Imported themes for that profile |
| `errorlog/` | Application error logs |

The installer program directory, normally `%LOCALAPPDATA%\Programs\PlayStash`,
is separate from these profiles. Portable packages still use the profile directory;
copying only the program ZIP does not copy your saved profiles.

WPF game roots contain `PlayStash\Downloads` and `PlayStash\Installations`, using
per-game ID/title folders. Local `playstash-metadata` and `playstash-exec` files
record extraction and launch state. Keep game saves separately backed up before
uninstalling or deleting an installation.

## Clearing data and moving installations

Use client controls to clear image caches, remove a download, uninstall a game or
change a configured root. Those are different actions. Clearing an image cache
should not be treated as uninstalling a game; deleting a profile or game directory
has broader consequences.

Exit the desktop client before copying its settings or moving a game root. Keep
the complete game tree and its generated configuration, add the destination root
in that same client, then check that the installation and launch path are detected.
Do not assume one client's folder structure will be imported by the other client.
