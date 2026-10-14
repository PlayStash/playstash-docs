# PlayStash Documentation

This private repository contains current PlayStash documentation and its
Docusaurus website source. Start with [the overview](docs/intro.md) or
[server installation](docs/server-docs/setup/setup.md).

The documentation covers Backend 17.1.4, Web/Desktop Frontend 17.2.3 and Windows
application 1.18.1: separate frontend/API containers, PostgreSQL, no subscription.

- [Steam, IGDB, metadata and covers](docs/server-docs/metadata-enrichment/metadata.md)
- [Clients and installers](docs/client-docs/setup.md)
- [Privacy and external services](docs/privacy.md)
- [Security checks](docs/security.md)
- [Authentication](docs/advanced-usage/authentication.md)
- [Builds and maintenance](docs/advanced-usage/development.md)

## Local website

Use the Node.js and pnpm versions declared in package.json:

```sh
pnpm install --frozen-lockfile
pnpm start
pnpm build
```

GitHub-hosted workflows check dependencies, secrets, content and the production
website on main/dev and pull requests. They upload a private Actions artifact.
No public website is deployed automatically; the default URL is a build setting.

Only main and dev are maintained and synchronized. PLAYSTASH_RUN_SELF_HOSTED
is false; it does not block hosted jobs. Read [AGENTS.md](AGENTS.md) and update
[CHANGELOG.md](CHANGELOG.md) with changes visible to readers.

## Attribution and license

Derived from documentation by Alkan Alper, Schäfer Philip GbR / Phalcode and
contributors. Attribution and the original license are preserved in
[NOTICE.txt](NOTICE.txt) and [LICENSE](LICENSE): CC BY-NC-SA 4.0.
