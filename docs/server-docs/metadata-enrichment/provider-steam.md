---
title: "Provider: Steam"
sidebar_position: 1
---

PlayStash's Steam provider fetches public Steam Store metadata. It needs **no Steam
account, Steam API key or PlayStash subscription**. It does not import purchased
games or download games from a Steam account.

## Enable Steam

In `docker-compose.yml`, add this entry to the **existing**
`playstash-backend.environment` mapping:

```yaml
      METADATA_STEAM_ENABLED: "true"
```

Keep the database, authentication and other environment entries. Do not add a
second `environment` block. See the [complete placement example](./metadata.md#enable-steam).

Run from the directory containing the Compose file:

```sh
docker compose up -d
```

That is all the provider setup requires. The backend needs outbound HTTPS access
to the Steam Store and Steam image servers. Adding the key only to `.env` does not
pass it into the supplied container unless the Compose environment references it.
YAML configuration is another option; see [configuration alternatives](./metadata.md#configuration-alternatives).

## Fetch metadata for existing games

Sign in as an administrator and open:

`Administration → Server diagnostics → Refresh all metadata → Queue refresh`

The refresh runs in the background. It preserves manual metadata and selected
provider IDs, obeys rate limits, and skips games whose paths contain `(NC)`.
Use `Read server logs` or `Refresh logs` in the same card to inspect progress.

## Find and remap a game

Open the game's `Settings` gear, then:

`Game Settings → Metadata → Steam → Search & Remap`

You can search using:

- A game title, for example `Portal 2`.
- A numeric Steam App ID, for example `620`.
- An exact HTTPS Steam Store app URL, for example
  `https://store.steampowered.com/app/620/`.

Choose `Remap` on the correct result. Numeric IDs and direct URLs resolve only
Steam entries of type game or DLC. Store availability affects the results; this
provider uses the English Steam Store with the US region.

## Configuration

| Setting | Purpose | Default |
| --- | --- | --- |
| `METADATA_STEAM_ENABLED` | Enable provider fetching | `false` |
| `METADATA_STEAM_PRIORITY` | Provider merge priority | `5` |
| `METADATA_STEAM_REQUEST_INTERVAL_MS` | Minimum delay between Steam Store requests, in milliseconds | `1000` |
| `METADATA_TTL_IN_DAYS` | Age before normally cached metadata is refreshed | `30` |

Steam requests are queued and recent responses are cached. The full administrator
refresh bypasses the metadata age and clears cached provider responses, while
retaining request limits. Temporary Steam errors are logged and leave existing
library data available.

[IGDB](./provider-igdb.md) has default priority `10`, so its values take precedence
when both providers supply the same field. Steam can still fill fields absent
from IGDB, such as system requirements. Manual metadata has the highest priority.

## Supplied metadata

Available fields depend on the Steam entry:

| PlayStash metadata | Steam Store source |
| --- | --- |
| Title and release date | App name and released date, when available |
| Description | Detailed or short description converted to text/Markdown |
| Age rating | Required age |
| Rating | Metacritic score, when available |
| Developers and publishers | Listed company names |
| Genres and tags | Genres and Steam feature categories |
| Minimum and recommended system requirements | PC requirement descriptions converted to Markdown |
| Cover | Steam's wide header image |
| Background | Steam's listed background image |
| Screenshot links | Full-size screenshots |
| Trailer links | Available WebM or MP4 movie links |
| Website links | Steam Store app page and the listed game website |

For a portrait cover, open `Game Settings → Edit Images → Cover`, upload an image
or use `Paste image URL`, then select `Save Images`. See the
[metadata guide](./metadata.md#set-your-own-covers-and-descriptions) for manual overrides.
