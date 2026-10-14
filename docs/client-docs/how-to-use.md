---
title: How to use
sidebar_position: 2
---

## Browse your library

Open `Library`, search for a game and use its filters or sorting controls. The
cross-platform interface supports local categories made from tag and folder
filters; administrators can also define shared automatic folder-tag rules.
Server permissions and age/access restrictions still determine which games you
can see. Local installed-game browsing requires a desktop client.

Open a game to read its description, requirements, screenshots, reviews and
progress. Set your own progress state on the game page. Package extras and saves
are described below. These features use the current PlayStash backend API; a
provider's credentials are configured [on the server](../server-docs/metadata-enrichment/metadata.md).

## File & Folder Structure

The Tauri desktop client uses the roots selected under
`Settings → Downloads → Download locations`. A fresh download uses:

```text
<Root>/PlayStash/<Title>/Versions/<Version>/Download/
<Root>/PlayStash/<Title>/Versions/<Version>/Extraction/
<Root>/PlayStash/<Title>/Versions/<Version>/Installation/
```

Titles and version labels are sanitized for local filenames. A version without a
label uses `Unspecified`; a conflicting label may include the version ID. Keep
the generated configuration files so PlayStash can recognize existing downloads.

The WPF application uses a different layout:

```text
<Root>/PlayStash/Downloads/(<GameID>)<Title>/
<Root>/PlayStash/Downloads/(<GameID>)<Title>/Extract/
<Root>/PlayStash/Installations/(<GameID>)<Title>/
```

These layouts are not interchangeable. Adding a Tauri root does not automatically
convert a WPF installation or the other client's preferences. Browser downloads
follow your browser's chosen destination.

## Downloading games

In the Tauri desktop client, use a game's download control and select a configured
location if needed. Monitor downloads in `Downloads`, where the current workflow
provides pause/resume, cancellation, extraction and installation actions.

In the browser, the game's download menu offers `Direct Download`. The browser
saves the file; it does not perform native extraction or installation. A
`Download via PlayStash Client` link requires a locally installed application that
handles `playstash://`; it does not install that application for you.

The WPF application's `Downloads` view manages its own queue and local paths. Its
current workflow downloads the server-selected game version; it does not offer
the Tauri version picker.

## Selecting a game version

When the Tauri/browser workflow finds multiple versions, it displays a version
selector before downloading. Choose the version you want. Distinct Tauri versions
use separate installation folders; a newer server version does not silently
replace an installed version.

## Extracting the game

For archived downloads, select `Extract` when the download is complete. Encrypted
archives need their archive password. Shared per-game archive passwords can come
from server metadata; local extraction defaults are separate client preferences.
Use the archive's own password rather than your PlayStash account password.

Automatic extraction is optional in each desktop client's installation settings.
If extraction fails, retain the original archive so you can retry and inspect the
reported error. Browser sessions need a local archive utility instead.

## Installing portable games

For portable games, select `Install` to put the extracted files into the game's
installation directory. Choose the game's launch executable in its local
`Launch Options` if the default is missing or incorrect. The client tracks the
selected local executable; a portable package may still need its own system
libraries or compatibility tools.

## Installing setup games

Select the installer from the installation dropdown, then choose `Install`.
Follow the game's setup process and use the installation destination displayed
by PlayStash. The Tauri Linux workflow displays a Windows-style destination when
launching a Windows installer through its compatibility tools.

An executable or setup action is an explicit local choice. A server-provided
package recipe is not executed just by browsing or downloading a package.
The server's game-type detection can be overridden by the administrator; if it
selects the wrong type, correct that classification or the local installation mode
instead of assuming every executable is an installer.

## Launching games

After installation, use the play control or select an available launch profile.
Local `Game Settings → Launch Options` controls the executable and parameters.
Shared launch profiles are named executable/parameter pairs configured for the
library, but they still execute only on a compatible desktop when selected.

Keep the desktop client running if you want its process-based playtime tracking.
A browser cannot observe local game processes. On Linux, Windows games can use
Wine/Proton through the Tauri client's compatibility settings; native game and
compatibility-tool support still depend on the game's requirements. The WPF
application can configure a local emulator and ROM under `Emulator / ROM`; it
does not supply emulators or ROMs.

## Packages, extras and addons

In the cross-platform game page, open `Package & extras`:

- Download individual extras, such as manuals or additional files.
- Explicitly choose `Use recipe for next download` to use a provided package
  installer recipe in the desktop workflow.
- Select optional addons and adjust their installation order. The desktop asks
  before applying addons because they can overwrite installed files.
- Select a named launch profile when you want to use it.

The WPF application exposes package extras and addon actions in game details using
its own controls. Do not assume identical labels or layouts across clients.

An addon failure stops the remaining sequence; files from already completed
addons remain applied. Keep a backup before replacing files you want to retain.
For package structure, see [Adding games](../server-docs/adding-games.md).

## Local post-install scripts

The Tauri desktop setting `Settings → Downloads → Post-install script` accepts a
local absolute script or executable path and a JSON array of arguments. `%F` is
replaced with the installation directory as one literal argument. Executables,
`.sh` and `.ps1` files are supported where their interpreters are available.

The path is empty by default. After you explicitly enable this setting, it runs
once after a successful installation with your own account permissions. It is
not a server command and does not ask for fresh consent on every installation.
Disable it by clearing the configured path. An error is reported separately even
if the game installation itself completed.

## Saves, integrations and metadata

Use the game's `Saves` tab in the browser/Tauri interface for ZIP save versions.
Native restore asks for the actual save folder and confirms overwriting. The
WPF application has its own optional automatic save integration and a separate
`Manage Cloud Save Versions` view. See [Integrations and save versions](./integrations.md).

For a wrong title match, missing description or custom cover, use the game's
shared metadata controls. Provider setup remains a backend setting; see
[Metadata, covers and game descriptions](../server-docs/metadata-enrichment/metadata.md).
