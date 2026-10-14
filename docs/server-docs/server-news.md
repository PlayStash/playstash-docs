---
sidebar_position: 11
---

# Server news

Your installation's server news is Markdown stored in `/config/news.md`, or `data/config/news.md` beside the supplied Compose file. Add library announcements or links there; do not replace the config directory mount.

Administrators can edit server news in the client's News dialog: open the newspaper icon, select **Server News**, and use **Edit**. The editor saves through the backend. Product/release news is a separate view bundled from the client repository's changelog; it is not a central remote-news subscription.

## API

- `GET /api/config/news`: read news for a signed-in permitted user; returns 404 if no file exists.
- `PUT /api/config/news`: Admin-only replacement with `{ "content": "Markdown text" }`.

The backend must be able to write its config directory. File edits by a host administrator also work; preserve the service account's permissions. Back up `data/config/` with the rest of the installation.
