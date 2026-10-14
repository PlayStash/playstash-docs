---
sidebar_position: 12.5
---

# Save versions

Server save storage is available without a subscription, but is **disabled by default**. Add the following under the existing `playstash-backend.environment` block:

```yaml
SAVEFILES_ENABLED: "true"
```

Run `docker compose up -d`. The supplied Compose already mounts `data/savefiles/` to `/savefiles`. `SAVEFILES_MAX_SIZE` defaults to `1gb`, and `SAVEFILES_MAX_SAVES` retains 10 recent versions per user/game grouping.

Upload a ZIP with paths relative to the game's actual save folder. The frontend exposes versioned saves on a game page. A browser can upload/download/delete its save archives. In the desktop client, **Restore to save folder** asks you to select the local target and confirm overwrites before extraction. A stored archive does not make every game synchronize automatically; the client needs the correct save location.

## Ownership and API

The owner or an administrator can manage saves, subject to current game access and age restrictions:

- `POST /api/savefiles/user/:user_id/game/:game_id`: upload multipart field `file`; optional `X-Installation-Id` must be a UUID v4.
- `GET /api/savefiles/user/:user_id/game/:game_id/versions`: list versions, newest first.
- `GET /api/savefiles/user/:user_id/game/:game_id/versions/:filename`: download one listed version.
- `DELETE /api/savefiles/user/:user_id/game/:game_id/versions/:filename`: delete that chosen version only.

Use the returned filename, URL-encoded, for selected-version calls. Listings expose filename, size, creation time and optional installation ID; physical server paths are not returned. The older base GET endpoint downloads the newest save, and base DELETE removes all saved versions for that user/game, so use the version-specific DELETE for selective removal.

Back up `data/savefiles/` with the matching database/configuration. Restore operations can overwrite local game saves; keep a local copy of files you want to retain.
