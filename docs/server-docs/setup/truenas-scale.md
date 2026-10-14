---
sidebar_position: 6
---

# TrueNAS

Use [the complete PlayStash Compose project](docker-compose.md) on a TrueNAS version that supports Docker Compose applications, or install Docker in a Linux VM and run the stack there. Import all services from [docker-compose.yml](/downloads/docker-compose.yml); do not select an obsolete third-party single-container catalog entry.

Choose a persistent dataset for the project. Preserve the relative `data/` and `games/` directories, or update every bind mount to explicit dataset paths. The backend service needs writable ordinary directories owned by its configured `PUID`/`PGID` (1000/1000 by default). Keep database data on storage suitable for PostgreSQL. Do not use symlinks inside a mounted game directory.

The project starts a one-time password initializer, PostgreSQL, the API and the frontend. Open the frontend at `http://NAS-IP:8080` and create your first administrator. Neither database port 5432 nor the backend API port should be exposed publicly.

Platform app forms differ between TrueNAS versions. When your version cannot import a full Compose project, the Linux-VM approach uses the same supported images and commands. See [backups](../backup-and-restore.md) before altering datasets or replacing the project, and [reverse proxy configuration](reverse-proxy.md) for public HTTPS access.
