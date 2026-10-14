---
title: "Provider: IGDB"
sidebar_position: 2
---

[IGDB](https://www.igdb.com/) provides video-game descriptions, covers, screenshots
and other metadata. PlayStash's backend uses Twitch application credentials to
access the IGDB API. No subscription to PlayStash is required.

## Create credentials

1. Sign in to Twitch and enable two-factor authentication.
2. Open the [Twitch Developer dashboard](https://dev.twitch.tv/console/apps) and
   register an application.
3. Set the application's client type to `Confidential`. IGDB does not use the
   OAuth redirect URL; its instructions say to enter `localhost`.
4. Open `Manage` for the application, choose `New Secret`, and record its Client ID
   and Client Secret.

Follow the [official IGDB setup instructions](https://api-docs.igdb.com/#account-creation)
if the developer dashboard changes. PlayStash obtains the application access
token automatically; you do not need to obtain or paste a bearer token.

## Configure the backend

Add these keys to the **existing** `playstash-backend.environment` mapping in your
`docker-compose.yml`:

```yaml
      METADATA_IGDB_ENABLED: "true"
      METADATA_IGDB_CLIENT_ID: "YOUR_CLIENT_ID"
      METADATA_IGDB_CLIENT_SECRET: "YOUR_CLIENT_SECRET"
```

Keep the existing database, authentication, volumes and other service settings.
Do not add a duplicate `environment` block. For a complete example showing where
the environment belongs, see the [metadata guide](./metadata.md#enable-steam).

Apply the change from the directory containing your Compose file:

```sh
docker compose up -d
```

Adding credentials to `.env` alone does not pass them into the supplied backend
container. The Compose environment mapping must contain them directly or reference
the `.env` keys explicitly. You can also configure YAML or a mounted secret file;
see [configuration alternatives](./metadata.md#configuration-alternatives).
Keep your Client Secret private and out of committed files.

IGDB's enable flag defaults to `true`, but the provider is not registered until
both credentials are present. A missing-credentials warning appears in the backend
logs. Setting the flag to `false` disables fetching even with valid credentials.

## Fetch metadata and correct matches

For an existing library, sign in as an administrator and select:

`Administration → Server diagnostics → Refresh all metadata → Queue refresh`

The refresh runs in the background, preserves chosen mappings and manual metadata,
and respects provider rate limits and `(NC)` paths. Use `Read server logs` or
`Refresh logs` in the same card to inspect progress.

To correct one match, open the game's `Settings` gear, then:

`Game Settings → Metadata → IGDB → Search & Remap`

Search by title or numeric **IGDB game ID**, then choose `Remap` on the correct
result. Steam App IDs are different IDs and cannot be used as IGDB game IDs.

## Configuration

| Setting | Purpose | Default |
| --- | --- | --- |
| `METADATA_IGDB_ENABLED` | Enable provider fetching | `true`; credentials required |
| `METADATA_IGDB_CLIENT_ID` | Twitch application's Client ID | Not set |
| `METADATA_IGDB_CLIENT_SECRET` | Twitch application's Client Secret | Not set |
| `METADATA_IGDB_PRIORITY` | Provider merge priority | `10` |
| `METADATA_IGDB_REQUEST_INTERVAL_MS` | Delay between provider updates, in milliseconds | `250` |
| `METADATA_TTL_IN_DAYS` | Age before normally cached metadata is refreshed | `30` |

Higher priority provider values replace lower priority values for fields both
providers supply. Manual metadata takes precedence over all providers. Keep
provider priorities distinct. IGDB documents a limit of four API requests per
second, so preserve the configured delay unless you understand those limits.

## Supplied metadata

Available fields depend on the game entry in IGDB. Current mappings include:

| PlayStash metadata | Source and behavior |
| --- | --- |
| Title and release date | Game name and first release date |
| Description | Summary and storyline, combined when both are present |
| Rating | IGDB's total rating |
| Average playtime | Normal completion time converted from seconds to minutes, when available |
| Age rating | Recognized rating-category names mapped to minimum ages, then averaged and rounded |
| Early access | IGDB status names `alpha`, `beta` or `early access`; file-derived and manual metadata can take precedence |
| Developers and publishers | Companies marked as developers or publishers |
| Genres and tags | Genres, keywords and themes |
| Cover | IGDB cover downloaded at `t_cover_big_2x` resolution |
| Background | First artwork downloaded at `t_1080p_2x` resolution, when present |
| Screenshot links | Screenshots and artwork at `t_1080p_2x` resolution |
| Trailer links | YouTube videos whose names contain trailer, teaser, intro, showcase or preview |
| Gameplay links | YouTube videos whose names contain gameplay, playthrough or demo |
| Website links | Websites listed for the game |

IGDB does not supply PlayStash's system-requirement fields. Enable
[Steam](./provider-steam.md) alongside IGDB or fill those fields manually.
If an entry has no artwork, IGDB does not use a screenshot as the stored background;
you can set your own image under `Game Settings → Edit Images`.

Provider errors are logged and leave the existing library available. For manual
covers and description edits, see the [metadata guide](./metadata.md#set-your-own-covers-and-descriptions).
