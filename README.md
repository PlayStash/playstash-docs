# PlayStash Documentation

This repository contains current PlayStash documentation and its Docusaurus
website source, published at <https://playstash.github.io/playstash-docs/>.
Start with [the overview](docs/intro.md) or
[server installation](docs/server-docs/setup/setup.md).

The deployment uses independently published frontend and API images, PostgreSQL,
and one Compose file. The server downloads prebuilt images. Versions and review
scope are recorded in [the verification checkpoint](docs/advanced-usage/development.md#verified-checkpoint);
deployment updates do not imply that every client feature was reviewed again.

- [Steam, IGDB, metadata and covers](docs/server-docs/metadata-enrichment/metadata.md)
- [Clients and installers](docs/client-docs/setup.md)
- [Privacy and external services](docs/privacy.md)
- [Security checks](docs/security.md)
- [Authentication](docs/advanced-usage/authentication.md)
- [Builds and maintenance](docs/advanced-usage/development.md)

The web image is `ghcr.io/playstash/playstash-frontend:latest`; the API and
initializer use `ghcr.io/playstash/playstash-backend:latest`, and PostgreSQL uses
the backend package's `postgres16` tag. After applying the current Compose file,
server updates are `docker compose pull` followed by `docker compose up -d`.

## Local website

Use the Node.js and pnpm versions declared in package.json:

```sh
pnpm install --frozen-lockfile
pnpm start
pnpm check:docs
pnpm check:security
pnpm audit --audit-level=low
pnpm build
pnpm check:site
```

GitHub-hosted workflows check dependencies, secrets, content and the production
website on main/dev and pull requests and upload the build as an Actions
artifact. When the build workflow's checks pass on main, that build is deployed
to GitHub Pages; dev and pull requests are not published.

Only main and dev are maintained and synchronized. PLAYSTASH_RUN_SELF_HOSTED
is false; it does not block hosted jobs. Read [AGENTS.md](AGENTS.md) and update
[CHANGELOG.md](CHANGELOG.md) with changes visible to readers.

## License

Licensed under CC BY-NC-SA 4.0; see [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt).
