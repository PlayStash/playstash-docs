---
sidebar_position: 1
---

# Choose a server setup

The supported production installation is [one Docker Compose stack](docker-compose.md) with separate frontend, API and PostgreSQL containers. GitHub builds the AMD64 and ARM64 images. The server downloads them and starts the services; it does not build source code.

1. Install Docker Engine and its Compose plugin on your Linux host or Linux virtual machine.
2. Download [docker-compose.yml](/downloads/docker-compose.yml) into its own installation directory.
3. Run `docker compose up -d` there.
4. Open `http://SERVER-IP:8080` and register your first administrator account.

The public port belongs to the frontend. The backend and PostgreSQL remain on the private Compose network. Complete the first registration before exposing the installation to other users. No subscription, registry account or mandatory `.env` file is needed.

See the [Compose guide](docker-compose.md) for storage, updates, backups and public image tags, and [reverse proxy guide](reverse-proxy.md) for HTTPS.

The web image is published by `playstash-frontend`; the API and PostgreSQL images
are published by `playstash-backend`. After installation, updates are
`docker compose pull` followed by `docker compose up -d` from the same directory.

## NAS and managed platforms

Use the same Compose file on [Synology](synology-container-manager.md), [Unraid](unraid.md) or [TrueNAS](truenas-scale.md) when your platform supports a complete Compose project. If it does not, run the stack in a Linux VM. A single-container vendor template cannot represent this deployment.

[Native development](native.md) is available to contributors. It is not required for installing the server.
