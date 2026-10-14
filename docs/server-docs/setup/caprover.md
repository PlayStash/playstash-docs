---
sidebar_position: 8
---

# CapRover and single-app platforms

The supported PlayStash installation uses one Docker Compose project with separate frontend, backend and PostgreSQL services plus a completed initializer. A CapRover single-app definition does not reproduce its startup dependencies, private secret storage, health checks and bind mounts.

Run [the supplied Compose stack](docker-compose.md) on a Linux host or VM. If CapRover supplies your outer HTTPS proxy, route one hostname to the frontend's host port 8080 and follow [the trusted reverse proxy settings](reverse-proxy.md). Keep PostgreSQL and the backend private.

There is no maintained PlayStash one-click CapRover template in this repository. Do not deploy the old upstream image or reduce the installation to a backend-only container.
