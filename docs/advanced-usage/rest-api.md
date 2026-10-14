---
sidebar_position: 5
---

# REST API and integration contracts

Open your frontend URL followed by /api/docs for Swagger and /api/docs-json for
OpenAPI. The frontend proxies these paths; no separate public API port is needed.

Use the supported login/token/API-key method. Activation, game restrictions,
parental age and save ownership apply to API callers. Do not put keys in URLs.

Administrators queue metadata refresh with POST /api/metadata/recache.
HTTP 202 queues work; HTTP 409 means another batch is active. Reindexing scans
game files and is a separate operation.

[WebSockets](../server-docs/websockets.md) describes Socket.IO at /socket.io/.
