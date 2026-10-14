---
sidebar_position: 5
---

# Unraid

Deploy the complete [PlayStash Compose file](/downloads/docker-compose.yml) with a Compose-capable project manager on your Unraid host, or run it in a Linux VM with Docker. The current deployment requires separate frontend, backend and PostgreSQL services; a single-container community application template is insufficient.

Keep the project directory on persistent storage. The default relative bind mounts create `data/` and `games/` beside the Compose file. If you replace these with Unraid share paths, preserve every mount, including `data/config/`, `data/secrets/` and `data/postgres/`. Mount games into the backend's `/files`, not the frontend.

Select `PUID` and `PGID` for an account that owns the backend storage. The default is 1000/1000. Do not apply those IDs to PostgreSQL or the frontend: their images manage their own service users. Avoid changing ownership of a running PostgreSQL data directory manually.

Start the project and open `http://UNRAID-IP:8080` to register the first administrator. Use [the Compose guide](docker-compose.md) for updates, backups and diagnostics, and [the reverse proxy guide](reverse-proxy.md) for HTTPS. Installer files are built by GitHub; this server stack does not need a Windows or Linux desktop runner.
