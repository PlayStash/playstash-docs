---
sidebar_position: 10
---

# Age and selected-user access

Age restrictions are disabled by default. Set `PARENTAL_AGE_RESTRICTION_ENABLED: "true"` under the backend environment block and recreate it with `docker compose up -d` to enable them. Supply birth dates for existing users; new registration then requires a birth date.

Non-admin users cannot access games above their age rating, including related progress, downloads, media and package assets. Admins can access the full library. Do not assign children the Admin role. Games without a minimum-age rating remain visible, so review missing/incorrect ratings manually.

Metadata-provider priorities determine the effective rating when several providers supply it; manual user metadata overrides provider values. An editor/admin can adjust a game's custom metadata. Verify the effective minimum age in the client rather than assuming a provider's rating covers every package.

`PARENTAL_AGE_OF_MAJORITY` defaults to 18. Below that age, birth-date changes require an administrator; adult users can edit their own birth date.

## Selected-user restrictions

A game's shared metadata can also set `access_restricted: true` with `allowed_user_ids`. This is independent of age. Only those users and admins see the game and associated resources; an empty allowed list makes it admin-only. Use [shared library options](library-options.md) for the exact fields.

`share_restricted_activity` is off by default. A player must opt in before other permitted users can see their private-game activity/progress and before admins can inspect that player's restricted-game metrics. [Chat](websockets.md), [reviews](feedback.md), saves and downloads recheck current game access rather than relying on an older cached list.
