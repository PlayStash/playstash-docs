---
sidebar_position: 4
---

# Synology Container Manager

Create a **Project** containing the complete [PlayStash Compose file](/downloads/docker-compose.yml). It starts separate frontend, backend and PostgreSQL services plus a one-time initializer. Use the published images; no source build or old vendor catalog entry is needed.

1. Create a persistent installation folder on the NAS and place `docker-compose.yml` inside it.
2. In Container Manager, create a project using that file and installation directory.
3. Ensure the project can create and write its `data/` and `games/` subdirectories. If using another backend owner, set the corresponding `PUID` and `PGID` in the project environment and keep them on later starts.
4. Start the entire project. The initializer finishes successfully, PostgreSQL becomes healthy, and the backend and frontend follow.
5. Open `http://NAS-IP:8080` and register the first administrator.

The images support Linux AMD64 and ARM64. The NAS must support Docker Compose projects for this workflow. On systems without that support, use a Linux VM with Docker.

Add provider and signup settings under **`playstash-backend.environment`**, then redeploy the project. Put the NAS HTTPS reverse proxy in front of the frontend's port 8080; see [reverse proxy configuration](reverse-proxy.md). Follow [the same backup and update procedure](docker-compose.md) as other hosts.
