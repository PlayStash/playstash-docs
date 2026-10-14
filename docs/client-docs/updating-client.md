---
title: Updating the client
sidebar_position: 3
---

## Cross-platform client

The Tauri client has an updater, but it requests release feeds anonymously.
PlayStash's source repositories and releases are private, so those feeds are not
accessible to an ordinary anonymous installation. Until the maintainers provide
public release hosting, download updates manually while signed in to GitHub with
repository access.

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
Close the application before installing the update. For a portable installation,
replace the program files with the full new package; preserve the profile data in
`%APPDATA%\PlayStash` and your configured game roots.

The WPF application does not use the Tauri updater feed. Its packages contain the
required .NET runtime, so an application update also updates that bundled runtime.

## Web UI

The browser interface updates when the server operator updates the frontend
container. In the server's Compose directory, run:

```sh
docker compose up -d
```

The standard Compose pulls stable images on each start. Reload the browser after
the containers are ready. The frontend image is pinned to a tested frontend release
by the server publisher; a frontend repository push does not independently replace
an already published server image. See [Server status and updates](../server-docs/setup/docker-compose.md#status-updates-and-stopping).

## Update channels

Source repositories contain only `main` and `dev`:

| Tauri channel | Source branch | Purpose |
| --- | --- | --- |
| `stable` | `main` | Published stable frontend version |
| `unstable` | `dev` | Development builds with a unique prerelease version |

The desktop client exposes `Settings → About → Updates → Update channel`.
The `Unstable` picker option is shown when Developer Tools are unlocked by five
quick clicks on the application version. Changing a channel does not grant access
to private downloads or bypass the
anonymous-feed limitation. WPF development artifacts and stable releases are
built separately in `playstash-app`; they are not these Tauri channels.

GitHub-hosted workflows build desktop packages automatically. A new source version
is published only after the complete package matrix succeeds. Published versions
are immutable; changed packages require a new version. Development and same-version
builds can also be obtained from authenticated Actions artifacts where available.
