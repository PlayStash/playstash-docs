---
sidebar_position: 8
---

# Troubleshooting

## Server does not open

Run docker compose ps and docker compose logs --tail=100 from its directory.
playstash-init should exit 0; database, backend and frontend should become
healthy. Only the frontend exposes host port 8080, or your configured port.

Public GHCR images need no registry login. Retain data/config/auth-seed and
data/secrets/postgres-password with the database and other persistent data.

## Accounts

First registration is active ADMIN. Later users need activation.
SERVER_REGISTRATION_DISABLED disables Basic signup; sign-in and configured SSO
are separate. Deactivated administrators are also blocked.

## Metadata

Steam defaults to off. Set METADATA_STEAM_ENABLED: "true" under backend environment,
then docker compose up -d. No Steam key is needed. A free-standing .env entry
alone is not passed to the backend.

IGDB requires its Client ID and Client Secret. Follow
[metadata setup](server-docs/metadata-enrichment/metadata.md), then queue
Administration → Server diagnostics → Refresh all metadata.
Check logs; refresh preserves chosen mappings and manual metadata.

## Proxy and chat

Forward all paths to the frontend and enable WebSockets. Configure
PLAYSTASH_TRUSTED_PROXY_CIDRS for the actual proxy peer address/CIDR and correct
Host, X-Forwarded-Proto and X-Forwarded-For headers.
See [server setup](server-docs/setup/setup.md).

## Desktop

The frontend's signed updater feeds are public. Check the selected channel,
available platform package and updater error; manual frontend release downloads
are also public. The separate Windows application still requires access to its
private GitHub repository. Browsers cannot run native installation/launch actions.
Verify executable, installation directory and Wine/Proton settings and inspect logs.

Report client/server versions, OS, steps and redacted logs. Never send credentials.
Old issue reports containing only private discussion links remain unverified
without a concrete reproduction.
