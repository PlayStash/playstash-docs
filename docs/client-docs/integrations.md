---
title: Integrations and save versions
sidebar_position: 6
---

The native desktop applications provide integration settings and automatic cloud
saves. Browser users can manage save archives manually. No integration requires a
paid PlayStash subscription, but local software, your own credentials and server
permissions still apply. The sections below distinguish desktop automation from
manual save-version controls.

## WPF Steam shortcuts

In the Windows application, open
`Settings → Integrations → Steam → Sync Steam shortcuts`.
Installed games are added as non-Steam shortcuts. Restart Steam to see changes;
`Restore Backup` restores the application's saved shortcut backup when needed.

Shortcuts point to the installed game executable to support Steam's game tracking
and overlay. Keep PlayStash running for its own playtime tracking and post-game
save backups. A game launched directly through Steam does not run PlayStash's
prelaunch cloud-save restore.

This is a local launcher integration. It is separate from the backend's
[Steam metadata provider](../server-docs/metadata-enrichment/provider-steam.md),
which needs only `METADATA_STEAM_ENABLED=true` and no Steam account or API key.

## WPF Discord presence

Open `Settings → Integrations → Discord`, enter your own Discord application ID,
and enable `Sync Discord presence`. Alternatively, the desktop process can read
`PLAYSTASH_DISCORD_APPLICATION_ID` from its environment when the setting is empty.
This is a desktop setting, not a variable for the Docker backend.

Presence uses the locally running Discord client and displays the tracked game's
name. Disable the integration if you do not want that information shown in Discord.
The Discord application ID is distinct from an IGDB/Twitch Client ID and from an
optional maintainer release-notification webhook.

## Playnite

The [PlayStash Playnite extension](https://github.com/PlayStash/playstash-playnite-integration)
uses the WPF Windows application:

1. Install and launch the WPF application, then sign in to your server.
2. Download an accessible `.pext` release from the private extension repository
   while signed in to GitHub, and install it in Playnite.
3. In Playnite, open `Library → Configure Integrations... → PlayStash`.
4. Choose `Update Game Library → PlayStash` to import your library.

Keep the client installed with the `playstash://` protocol registered. The
extension uses the local `PlayStash` named pipe and the signed-in client; it does
not need another PlayStash account. It rejects a pipe server owned by another
Windows user. This extension is not a browser or Tauri integration.

## Server prerequisites for saves

An administrator must set `SAVEFILES_ENABLED: "true"` under the backend's existing
Compose environment and run `docker compose up -d`. The standard Compose already
mounts persistent save storage at `data/savefiles/`; enabling storage does not
configure a game's local save paths or upload archives by itself.

Save versions belong to a user and a game. Owners and administrators can access
them subject to library permissions. Game installation files and metadata-provider
credentials are different from save archives.

## Browser and Tauri save versions

Open the game's `Saves` tab. `Upload new version` accepts a ZIP containing paths
relative to the game's actual save folder. Existing versions can be downloaded
or removed with `Delete version`; deletion asks for confirmation and removes only
that version from the server.

In the Tauri desktop client, `Restore to save folder` opens a local folder chooser.
Select the game's real save folder, then confirm `Restore and overwrite files`.
Keep a copy of files you want to retain. The browser can download the archive for
manual restoration but cannot write it directly into your game's local save folder.

These controls manage explicit ZIP uploads and restores. Automatic desktop cloud
saves use Ludusavi's archive layout and their own restore operation; do not assume
those archives can be restored as a plain relative-path ZIP through the folder
chooser.

## Tauri automatic cloud saves

The Tauri desktop client uses its bundled Ludusavi tool to find save files. Enable
[save storage on the server](#server-prerequisites-for-saves), then open
`Settings → Integrations → Cloud Saves → Sync cloud saves`. This switch is
**off by default**. When enabled, PlayStash attempts a restore before launching a
game and a backup/upload after its tracked session ends. Keep the desktop client
running while playing, and check its sync messages for failures or conflicts.

`Custom Ludusavi Manifests` accepts local file paths or HTTP(S) URLs. Use `Add`,
enter each path or URL, then select `Save`. `Use Primary Manifest` is enabled by
default; it can be disabled when you want to use your own definitions. These
settings remain available alongside bundled local manifests.

### Bundle a save definition with a game

Starting with Tauri **17.3.1**, PlayStash explicitly includes
`<actual installation folder>/.ludusavi.yaml` when finding and backing up a game.
This also works with the versioned installation layout:

```text
<Root>/PlayStash/<Title>/Versions/<Version>/Installation/.ludusavi.yaml
```

Place the file directly in the game's actual installation folder, alongside its
installed files. A copy left only in `Download` or `Extraction` is not the installed
game's local manifest. You do not need to add this installed file manually to
`Custom Ludusavi Manifests`.

For automatic detection, use a regular YAML file no larger than **1 MiB**. An
invalid definition produces a sync error; correct the manifest before trying again.

For a game named `My Game` that writes saves to its own `saves/` folder and settings
to `settings.json`, use this `.ludusavi.yaml`:

```yaml
My Game:
  files:
    <base>/saves:
      tags:
        - save
    <base>/settings.json:
      tags:
        - config
```

Replace `My Game` with the game's matching PlayStash title. Matching uses its
metadata title when available, falling back to its game title, and still requires
a confident Ludusavi match. The client does not blindly choose the first entry in
a local manifest.

For this bundled manifest, `<base>` resolves to the installation folder containing
`.ludusavi.yaml`. The example therefore collects that folder's `saves/` tree and
`settings.json`; change the definitions to the locations the game actually uses.
The generated `.playstash.game.config.json` keeps installation/launch state; save
path definitions belong in the Ludusavi manifest. See the
[Ludusavi manifest format](https://github.com/mtkennerly/ludusavi-manifest#format)
for other supported placeholders and file definitions.

Detection uses these manifests and their declared paths. It does not monitor a
game's file accesses or inspect an arbitrary executable to discover every save or
configuration path. Games missing a correct matching definition need an adjusted
manifest or manual save archives. Browser downloads do not run this native sync.

## WPF automatic cloud saves

Open `Settings → Integrations → Cloud Saves → Sync cloud saves`.
The WPF application uses its bundled, source-built Ludusavi save tool to match a
game and collect its local saves. The primary manifest and optional custom manifest
paths/URLs control detection. A game must have a supported matching save definition
for automatic backup/restore to work.

Keep PlayStash running while playing so its tracked process exit can trigger a
save backup. A normal PlayStash launch can restore newer server saves; launching
through a direct Steam shortcut skips that prelaunch step. Watch the client status
for failed matching, upload or restore operations instead of assuming every game
has been synchronized.

Open `Manage Cloud Save Versions` in WPF game details to list archives, choose
`Download Selected` or `Delete Selected`, and refresh the list. Administrators can
select another user. Downloading an archived version from this view does not itself
restore it into the running game's save files.

## Privacy

Cloud-save archives are uploaded to your own PlayStash server. Discord presence
uses Discord; Steam shortcuts modify local Steam launcher data. Their controls
are independent of anonymous usage analytics. See [Privacy](../privacy.md) for
the current analytics configuration, account activity settings and external requests.
