---
sidebar_position: 2
---

# Stable and development channels

PlayStash maintains main and dev only. There is no separate early-access branch
or paid access program.

Main is stable source; dev produces development artifacts and tags. Published
release versions are immutable. Changed release packages require a new version;
same-version pushes can still produce Actions build artifacts.

Server stable images use latest/frontend/postgres16. Development uses
dev/frontend-dev/postgres16-dev. Keep a compatible set rather than mixing channels.

Private desktop release feeds are unavailable to the anonymous updater.
Use signed-in GitHub downloads. See [client updates](../client-docs/updating-client.md).
