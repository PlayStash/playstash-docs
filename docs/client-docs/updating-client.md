---
title: Updating the client
sidebar_position: 3
---

## Cross-platform client

The Tauri client checks the frontend's public signed release feeds without GitHub
sign-in. Open `Settings → About → Updates` to check for an update, then confirm
installation and restart when prompted. Official desktop builds include the
updater verification key; the selected channel must have a published signed feed
and a package matching your platform.

You can also update manually, including when the installed build has no configured
updater or a matching signed package is unavailable:

1. Open [frontend Releases](https://github.com/PlayStash/playstash-frontend/releases).
2. Download the package for your operating system and architecture.
3. Close PlayStash and install the new package, or replace your Linux AppImage.
4. Launch the updated client and verify its version under `Settings → About`.

For `.deb` installations, install the new Debian package manually. The AppImage
updater does not update a Debian installation. Keep your game roots and local
application data if you want to retain downloaded games and preferences.

## Windows application

Download the new installer or portable ZIP from
[Windows application Releases](https://github.com/PlayStash/playstash-app/releases).
This separate repository remains private; GitHub sign-in with access is required.
Close the application before installing the update. For a portable installation,
replace the program files with the full new package; preserve the profile data in
`%APPDATA%\PlayStash` and your configured game roots.

The WPF application does not use the Tauri updater feed. Its packages contain the
required .NET runtime, so an application update also updates that bundled runtime.

## Web UI

The browser interface updates when the server operator updates the frontend
container. In the server's Compose directory, run:

```sh
docker compose pull
docker compose up -d
```

The frontend repository publishes its own image,
`ghcr.io/playstash/playstash-frontend:latest`, from successful main builds. The
Compose frontend service follows that tag, so a frontend update does not need a
backend release. Reload the browser after the containers are healthy.

If your existing Compose points its frontend service at the backend image
package, update the service's `image` to the address above before pulling.
Keep your backend settings, volumes and PostgreSQL data. A version-pinned image
stays on its chosen version until you change the tag. See [server status and
updates](../server-docs/setup/docker-compose.md#status-updates-and-stopping).

## Update channels

Source repositories contain only `main` and `dev`:

| Tauri channel | Source branch | Purpose |
| --- | --- | --- |
| `stable` | `main` | Published stable frontend version |
| `unstable` | `dev` | Development builds with a unique prerelease version |

The desktop client exposes `Settings → About → Updates → Update channel`.
The `Unstable` picker option is shown when Developer Tools are unlocked by five
quick clicks on the application version. Both frontend channels use public
release feeds. WPF development artifacts and stable releases are
built separately in `playstash-app`; they are not these Tauri channels.

GitHub-hosted workflows build desktop packages automatically. A new source version
is published only after the complete package matrix succeeds. Published versions
are immutable; changed packages require a new version. Development and same-version
builds can also be obtained from authenticated Actions artifacts where available.
