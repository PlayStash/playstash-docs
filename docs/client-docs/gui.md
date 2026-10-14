---
title: Interface overview
sidebar_position: 98
---

The browser and Tauri desktop client share the React interface. The separate WPF
Windows application has its own layout. Native-only controls are hidden or disabled
in browser sessions, and server roles determine access to shared editing and
administration.

## Login window

See [Initial configuration](./setup.md#initial-configuration) for browser/Tauri
sign-in, WPF profiles and server-configured SSO. The current WPF application supports
multiple profiles without a paid subscription; the Tauri sign-in flow does not
use that WPF profile chooser.

## Library

Browse games, search, sort and apply filters. In the cross-platform interface,
local categories can save combinations of tag and folder filters. Installed-game
controls appear in the desktop client. Open a game card to see its details; its
`Settings` gear opens the game settings dialog.

The library is fetched in pages. There is no universal fixed 80-game page-size
promise across clients. Restricted games remain subject to server authorization;
a local category cannot bypass those restrictions.

## Game

The cross-platform game page includes description/media, progress and relevant
metadata, with `Requirements`, `Reviews`, `Package & extras` and `Saves` tabs.
You can submit public five-star reviews and change your own progress state.
Downloaded/installed-game controls require native client support.

`Package & extras` provides extra downloads, explicitly selected installer recipes,
ordered optional addons and named launch profiles. The `Saves` tab manages ZIP
save versions. See [How to use](./how-to-use.md) and
[Integrations and save versions](./integrations.md) for the differences between clients.

## Game settings

### Your computer

Native game settings manage the installation directory, uninstall action,
executable selection and launch parameters. The Tauri dialog includes
`Installation` and `Launch Options`; Linux compatibility options are available
where relevant. These settings affect the local computer rather than the entire
server library.

The WPF application also offers its own local launch settings, launch-profile
selection, desktop/launcher actions and `Emulator / ROM` configuration. It does
not provide an emulator or automatically classify ROMs.

### Server

Editors and administrators can use shared game metadata controls. Current
cross-platform labels include:

- `Edit Images`: upload or provide URLs for covers/backgrounds, then `Save Images`.
- `Metadata`: inspect providers and use `Search & Remap` to select a correct match.
- `Custom Metadata`: override shared fields and `Save Custom Metadata`.
- Administrator-only access controls: restrict a game and select allowed users.

Provider activation and credentials are backend configuration, not a form in this
dialog. See the [metadata guide](../server-docs/metadata-enrichment/metadata.md)
for setup, priorities and refreshing the library.

## Downloads

The Tauri desktop sidebar includes `Downloads` for its download, extraction and
installation workflow. Pause/resume, cancel/retry and installation controls depend
on the current card state. The browser sidebar does not show this native download
manager; direct file downloads are handled by the browser.

The WPF application has a separate `Downloads` view and a different game-root
layout. Its installation controls are documented in [How to use](./how-to-use.md).

## Community and chat

`Community` shows users and their accessible progress. `Chat` provides a lobby,
game rooms and direct messages, with presence options such as busy and invisible.
Game-room access follows game permissions. Chat requires the server's activity/chat
gateway and a reverse proxy that forwards WebSockets.

Chat history is temporary, retained for up to 24 hours and lost on server restart.
In the React frontend, presence is published while the chat page is connected.
The WPF application has separate community notification settings; do not assume
every presence or notification setting is shared between clients.

## Requests

`Requests` lets authenticated users request additions to the library and inspect
responses/status. The anonymous option hides the requester's identity in the
request presentation; it does not make this an unauthenticated public request form.
Administrators can update request status. These are library requests, not a shop
or payment workflow.

## User settings

Use your profile/account controls to edit permitted account details and user
images. Authentication, passwords, activation and roles are handled by your
PlayStash server. The WPF application provides `Settings → User → Edit User`,
profile switching, and logout actions for this device or all devices.

## Settings

The cross-platform interface offers searchable settings with the current categories:

| Category | Main controls |
| --- | --- |
| `Downloads` | Speed limit, image cache; native root locations, automatic extraction/installation/cleanup, post-install script |
| `Appearance` | Interface language, system/light/dark theme, zoom, Streamer / OPSEC Mode |
| `Sound` | Local interface volume and sound preview |
| `Startup` | Desktop startup and minimized-start behavior |
| `Games` | Desktop launch behavior, ignore list and launch logs; Linux Wine/Proton prefix location |
| `Privacy` | Account game-action reporting, restricted activity sharing, usage-analytics consent |
| `About` | Version, licenses and system information |
| `Developer Tools` | Optional troubleshooting and development controls |

Desktop-only groups are not offered as browser capabilities. Five quick clicks on
the version number reveal the React Developer Tools category. Optional verbose
diagnostics is for troubleshooting; it is independent of ordinary hang recovery.

The WPF application organizes settings into `Application`, `Installation`, `User`,
`Data`, `Integrations`, `About` and developer controls. `Application` contains the
interface language, fullscreen library, startup audio and theme generator. `Data`
contains game roots and cache controls. `Integrations` configures Steam shortcuts,
Discord presence and automatic cloud saves.

### Languages

Browser/Tauri: open `Settings → Appearance → Interface language` and choose device
default, English or German. Translated controls update immediately. Navigation and
appearance controls are translated; other pages, dynamic messages and server/game
content are not fully translated. Missing entries and unsupported device languages
fall back to English.

WPF: choose `Settings → Application → Interface Language`, then restart the
application. English and initial German catalogs cover common static labels;
missing translations and some dynamic messages remain English.

### Privacy

`Report completed game actions` sends selected lifecycle events to your own
server. `Share restricted game activity` changes account activity sharing and is
disabled by default. These controls are separate from `Help improve PlayStash`.

The published frontend has no configured usage-analytics endpoint/project, so
enabling that local consent switch alone does not enable external analytics.
A custom build can configure its own endpoint. See [Privacy](../privacy.md) for
what information goes where, including independent external font/media requests.

## Administration

Administrators can manage users and roles, activation, deletion/restoration,
automatic folder-tag rules and server actions. Current cards include `Actions`
with `Reindex Games`, and `Server diagnostics` with `Read server logs` and
`Refresh all metadata`.

Reindexing scans game files; metadata refresh contacts the configured providers.
Update the web interface by replacing its frontend container, not by restarting
an embedded backend web interface.

## News

Product news is bundled from the PlayStash frontend changelog. Server news comes
from your connected backend. The news control displays available entries; an
administrator can edit the server's news. It does not subscribe the client to an
upstream demo or a separate vendor account.

## Gamepad

The cross-platform library provides Big Picture mode from the library heading or
the controller Start button. D-pad/stick navigation moves focus, A activates and
B goes back. A connected controller and support in the current environment are
required; this does not emulate a controller inside a game.

The WPF application provides `Open Fullscreen Library` and an option to open it
at startup under `Settings → Application`. These are distinct implementations;
see each client's local settings rather than expecting identical layouts.
