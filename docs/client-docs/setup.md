---
title: Setting up a PlayStash client
sidebar_position: 1
---

Choose a browser session, the cross-platform desktop client, or the separate
Windows application. These are different clients with different local features.
The web image and cross-platform desktop packages come from the frontend
repository. The separate Windows application keeps its own release version.

## Installation

| Client | Where it runs | Distribution |
| --- | --- | --- |
| Web interface | Your browser | Served by the separate frontend container |
| Cross-platform desktop client, built with Tauri | Windows x64, Linux x64, macOS ARM64 and Intel | `playstash-frontend` Releases |
| Windows application, built with WPF | Windows 11 or newer, x64 | `playstash-app` Releases |

The frontend repository and its published Windows/Linux/macOS installers are
public. The separate Windows application in `playstash-app` remains private;
sign in to GitHub with an account that has access to download its releases.
Public Docker images allow anonymous server installation.

### Cross-platform client

Download a package from [PlayStash frontend Releases](https://github.com/PlayStash/playstash-frontend/releases):

- Windows: the x64 `-setup.exe` installer.
- Linux: the x64 `.deb` package or `.AppImage`. Make an AppImage executable before
  launching it; Linux runtime requirements depend on the distribution.
- macOS: the `.dmg` for your Mac's ARM64 or Intel architecture.

Install the package, then launch PlayStash. The client uses the same interface as
the browser, with native downloads, extraction, installation and launch features.
A desktop package does not make a game compatible with every operating system.
See [Updating the client](./updating-client.md) for signed updater and manual updates.

### Web UI

Open your server's public address, such as `https://games.example.com` or
`http://SERVER-IP:8080`. The Compose frontend container serves the interface and
forwards API and WebSocket requests to the separate backend container. You do not
need a separate public backend address.

The service runs `ghcr.io/playstash/playstash-frontend:latest`, published by the
frontend repository. The server operator updates that image with
`docker compose pull` and `docker compose up -d`; browser users then reload the
page. See [server installation](../server-docs/setup/docker-compose.md) for the
complete stack and current tags.

A browser can browse games, use account and administration features, download
files, and upload or download save archives. It cannot run the native game's
installer, launch local executables, track local processes, or restore a save
archive directly into a local game folder. Use a desktop client for those actions.

### Windows application

Download the x64 installer or portable ZIP from
[PlayStash Windows application Releases](https://github.com/PlayStash/playstash-app/releases).
Windows 11 or newer is required. The packages are self-contained: you do not need
to install a separate .NET runtime.

Run the installer, or extract the complete portable ZIP and launch `playstash.exe`.
Keep its accompanying libraries and files. The installer defaults to
`%LOCALAPPDATA%\Programs\PlayStash`. These packages currently have no configured
publisher signing certificate; evaluate Windows security prompts for the file you
actually downloaded.

The WPF application has its own profile chooser, themes, settings and integrations.
It is not the same executable or settings store as the Tauri desktop client.

## Initial configuration

Use the same public server URL in every client, including `https://` and any
configured port. For the supplied Compose, use the frontend's host port, not an
internal container address. Do not append `/api` to the normal server address.

### Browser and cross-platform desktop

In the desktop sign-in screen, enter `Server` and choose `Continue`. Then enter
`Username or Email` and `Password`, and choose `Login`. The browser uses the
address of the instance you opened.

Choose `Sign up` to register if Basic registration is enabled. On a fresh server,
the first registered account is an active administrator; subsequent accounts in
the standard setup need administrator activation. Disabled registration requires
an existing account or the server's configured SSO flow.

### Windows profiles

On the WPF profile chooser, use `New Profile`, then `Sign In` or `Sign Up`. Enter
the server URL and your own account details. You can save multiple profiles for
different servers and users without a paid subscription. Change profiles under
`Settings → User → Change Profile`.

`Import Server Connection` imports a shared server URL and installation preferences;
it does not log you in. Authenticate with your own account after importing. To
export a connection, use `Settings → Installation → Export Server Connection`.
Including an archive password requires explicit confirmation and writes it into
the exported JSON as plaintext. Account passwords, API keys and session tokens
are excluded. Treat exports that include an archive password as private files.

### Server input validation

The client checks the server and its advertised authentication options. If it
cannot connect, confirm the public URL, frontend/API health and reverse-proxy
WebSocket support. A Docker service name such as `playstash-backend` is only valid
inside the Compose network, not on another computer.

### SSO login

SSO is available only when an administrator has configured an identity provider
on the backend. The browser/Tauri interface offers `Login with SSO` or
`Continue with SSO`; the WPF sign-in form uses `Sign in using your Identity Provider`.
Complete authentication with the configured provider. Provider configuration and
account activation remain server responsibilities.

### Additional request headers

The WPF login window's settings can configure additional request headers for
instances behind an access gateway. These are connection settings for that
application; the browser/Tauri login does not offer the same header editor.
Do not put IGDB or Steam metadata settings here: those belong to the backend.

### Select the root directories

The Tauri desktop client stores games in locations chosen under
`Settings → Downloads → Download locations → Add Download Location`. You can add
multiple locations and choose the location when downloading. A `PlayStash`
subfolder is created inside each selected location.

The WPF application uses
`Settings → Data → File System → Root Directories`. Add one or more directories;
it creates separate `PlayStash\Downloads` and `PlayStash\Installations` trees.

Browser sessions use the browser's download destination and have no native game
root selector. See [How to use](./how-to-use.md) and [Data management](./data.md)
for the distinct directory layouts.
