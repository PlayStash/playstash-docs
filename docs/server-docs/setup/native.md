---
sidebar_position: 9
---

# Native source development

For a production installation, use [the prebuilt Compose stack](docker-compose.md). Source development is a separate workflow: the backend exposes an API, and the web interface runs from the frontend repository.

The frontend and backend source repositories are public. Follow the backend's [INSTALL.md](https://github.com/PlayStash/playstash-backend/blob/main/INSTALL.md) for Node.js LTS and pnpm prerequisites:

```sh
git clone https://github.com/PlayStash/playstash-backend.git
cd playstash-backend
pnpm install --frozen-lockfile
cp .dev.env .env
pnpm start
```

The checked-in development environment is for local development, not a production server. Production uses PostgreSQL. Configure your own empty PostgreSQL development database when exercising production-specific behavior. Do not enable `TESTING_*` options on an exposed server.

Clone [playstash-frontend](https://github.com/PlayStash/playstash-frontend), install its dependencies and run `pnpm dev` separately. API model generation requires Java 11 or newer; the hosted build uses Java 21. Point the client at your development backend address. Starting the backend alone does not serve a browser UI at `/`.

The stable branch is `main`; `dev` holds the synchronized development branch. Published server images require no local compiler or developer runner.
