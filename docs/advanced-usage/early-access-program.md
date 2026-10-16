---
sidebar_position: 2
---

# Stable and development channels

PlayStash maintains main and dev only. There is no separate early-access branch
or paid access program.

Main is stable source; dev produces development artifacts and tags. Published
release versions are immutable. Changed release packages require a new version;
same-version pushes can still produce Actions build artifacts.

The frontend repository publishes `ghcr.io/playstash/playstash-frontend:latest`
from main and `:dev` from dev. The backend repository publishes
`ghcr.io/playstash/playstash-backend:latest` and `:postgres16` for stable, or
`:dev` and `:postgres16-dev` for development. Both repositories also publish
immutable version tags. Keep a compatible set rather than mixing channels.

The supplied Compose follows stable images. For development, change the frontend
to `ghcr.io/playstash/playstash-frontend:dev`, the backend and initializer to
`ghcr.io/playstash/playstash-backend:dev`, and PostgreSQL to
`ghcr.io/playstash/playstash-backend:postgres16-dev`, then run
`docker compose pull` followed by `docker compose up -d`.

The frontend's stable and unstable signed updater feeds are public. The separate
Windows application's releases remain private and require GitHub access. See
[client updates](../client-docs/updating-client.md).
