---
sidebar_position: 2
---

# Configuration

This reference follows backend **17.1.4** and the server deployment containing frontend **17.2.3**. The production Compose stack uses PostgreSQL and separate API/frontend containers. Backend settings come from [configuration.ts](https://github.com/PlayStash/playstash-backend/blob/main/src/configuration.ts).

## Add a backend setting

Edit the existing `playstash-backend.environment` block in `docker-compose.yml`; keep its database and storage settings. For example, to enable Steam without an API key:

```yaml
services:
  playstash-backend:
    # Keep the service's existing image, environment entries and volumes.
    environment:
      METADATA_STEAM_ENABLED: "true"
```

The example shows the setting to **add**, not a replacement Compose file. Apply environment changes with:

```sh
docker compose up -d
```

A plain `docker compose restart` does not recreate a container with changed environment values. A variable placed only in `.env` is not automatically forwarded to the backend: Compose must reference it in `environment` or pass it using `env_file`. The provided Compose already references `PUID`, `PGID`, `PLAYSTASH_PORT` and `PLAYSTASH_TRUSTED_PROXY_CIDRS`; it does not reference every backend setting.

For provider setup and the refresh/remapping UI, see [metadata enrichment](metadata-enrichment/metadata.md).

## Files, secrets and precedence

For any backend setting below, an explicitly supplied `<VARIABLE>_FILE` points to a readable file **inside the backend container**. Its trimmed contents take precedence over the direct environment value. Mount your private file read-only before referencing it. The default database password is already managed this way; do not replace it with a sample password.

The backend also reads `config.yaml`, or `config.yml` if the first file is absent, from its config volume. With the supplied Compose, create it as `data/config/config.yaml` on the host. Flat variable names are unambiguous:

```yaml
METADATA_STEAM_ENABLED: true
SERVER_REGISTRATION_DISABLED: true
```

Nested keys are matched case-insensitively by splitting the environment name on underscores. Flat keys are checked first. For example:

```yaml
metadata:
  steam:
    enabled: true
```

Precedence is: explicit `_FILE` environment → explicit environment → YAML → built-in default. Compose's existing explicit database variables therefore override database YAML settings. Invalid YAML or unreadable secret files stop startup. YAML edits require a backend restart, such as `docker compose restart playstash-backend`; changed Compose environment requires `docker compose up -d`.

The tables show **application defaults**. The standard Compose overrides database connection values and authentication-key persistence, as explained below. Boolean examples use quoted `"true"`/`"false"` in Compose; lists are comma-separated unless stated otherwise.

## Deployment settings

These are interpreted by Compose/container startup rather than the backend configuration loader.

| Variable | Supplied Compose default | Purpose |
| --- | --- | --- |
| `PLAYSTASH_PORT` | `8080` | Host port of the frontend. Keep internal API/frontend port 8080 unchanged. |
| `PLAYSTASH_TRUSTED_PROXY_CIDRS` | Empty | Space-separated trusted outer proxy IPs/CIDRs; passed to the frontend. See [reverse proxy](setup/reverse-proxy.md). |
| `PUID`, `PGID` | `1000` | Backend storage owner and initializer. Do not change frontend/PostgreSQL service IDs using these values. |

## Server
| Variable | Application default | Purpose |
| --- | --- | --- |
| `SERVER_PORT` | 8080 | Backend listening port. Keep 8080 in the supplied Compose; use PLAYSTASH_PORT for the public port. |
| `SERVER_DEMO_MODE_ENABLED` | false | Disable selected mutation/download administration actions for demonstration servers. |
| `SERVER_LOG_LEVEL` | info | Server logging level. |
| `SERVER_LOG_FILES_ENABLED` | true | Write rotating files under VOLUMES_LOGS. |
| `SERVER_REQUEST_LOG_FORMAT` | Built-in Morgan format | Request log formatting. Default logs method/path/status; credential values and query strings are sanitized. |
| `SERVER_CORS_ALLOWED_ORIGINS` | Empty list | Exact comma-separated origins for cross-origin clients. Same-origin Compose browser requests need no addition; do not use a wildcard for credentialed requests. |
| `SERVER_REGISTRATION_DISABLED` | false | Disable Basic public self-registration. Administrators can still create users; SSO provisioning is separate. |
| `SERVER_ACCOUNT_ACTIVATION_DISABLED` | false | Activate newly registered users automatically. The first administrator is active regardless. |
| `SERVER_ADMIN_USERNAME` | Unset | Recover/promote an existing account at startup. A reserved account registration requires SERVER_ADMIN_PASSWORD. |
| `SERVER_ADMIN_PASSWORD` | Unset | Recovery password for SERVER_ADMIN_USERNAME; startup resets an existing account. This does not create an account. |
| `SERVER_MAX_DOWNLOAD_BANDWIDTH_IN_KBPS` | Unlimited | Per-transfer maximum in KiB/s. Zero means unlimited; a client cannot exceed it. |
| `SERVER_MAX_DOWNLOAD_BANDWIDTH_SCHEDULE` | Unset | Five-field cron expression selecting the inside-schedule limit. |
| `SERVER_MAX_DOWNLOAD_BANDWIDTH_SCHEDULE_TIMEZONE` | Host timezone | Timezone for the cron schedule, for example Europe/Berlin. |
| `SERVER_MAX_DOWNLOAD_BANDWIDTH_IN_KBPS_IN_SCHEDULE` | Base limit | Inside-schedule KiB/s limit; inherits the base limit when omitted. |
| `SERVER_MAX_DOWNLOAD_BANDWIDTH_IN_KBPS_OUT_SCHEDULE` | 0 | Outside-schedule KiB/s limit, zero means unlimited. |
| `SERVER_ONLINE_ACTIVITIES_DISABLED` | false | Disable the entire activity/chat Socket.IO gateway. |
| `SERVER_STACK_TRACE_LIMIT` | 10 | Maximum stack frames in error diagnostics. |
| `SERVER_HTTPS_ENABLED` | false | Start an additional backend TLS listener. The standard Compose instead terminates TLS at an outer proxy. |
| `SERVER_HTTPS_PORT` | 8443 | Port for that optional backend TLS listener. |
| `SERVER_HTTPS_KEY_PATH` | Unset | Backend TLS private-key path. |
| `SERVER_HTTPS_CERT_PATH` | Unset | Backend TLS certificate path. |
| `SERVER_HTTPS_CA_CERT_PATH` | Unset | Optional backend TLS CA certificate path. |

## Storage
| Variable | Application default | Purpose |
| --- | --- | --- |
| `VOLUMES_CONFIG` | /config | YAML config, server news, folder-tag rules and persisted authentication key. |
| `VOLUMES_FILES` | /files | Game files/folders; writable for upload and deletion. |
| `VOLUMES_MEDIA` | /media | Stored covers, backgrounds and avatars. |
| `VOLUMES_SAVEFILES` | /savefiles | Uploaded saves. |
| `VOLUMES_LOGS` | /logs | Rotating server logs. |
| `VOLUMES_SQLITEDB` | /db | Historical setting name also used for database backup/recovery storage. The production database remains PostgreSQL. |
| `VOLUMES_PLUGINS` | /plugins | Compiled backend plugins. |

## PostgreSQL
| Variable | Application default | Purpose |
| --- | --- | --- |
| `DB_SYSTEM` | POSTGRESQL | Production database engine. Leave POSTGRESQL in the supplied Compose. |
| `DB_HOST` | localhost; Compose: db | Database hostname. |
| `DB_PORT` | 5432 | Database TCP port. |
| `DB_USERNAME` | default; Compose: playstash | Database account. |
| `DB_PASSWORD` | default; Compose: generated secret file | Database password. The provided Compose uses DB_PASSWORD_FILE, never the application fallback. |
| `DB_DATABASE` | playstash | Database name. |
| `DB_DEBUG` | false | SQL diagnostic logging; keep disabled unless troubleshooting. |
| `DB_SYNCHRONIZE` | false | Direct entity/schema synchronization; leave disabled and use the existing migrations. |
| `DB_TLS_ENABLED` | false | Enable TLS to an external PostgreSQL server. |
| `DB_TLS_REJECT_UNAUTHORIZED_ENABLED` | false | Verify the external database certificate. Enable with a valid trust configuration for an external TLS database. |
| `DB_TLS_KEY_PATH` | Empty | Client private-key path. |
| `DB_TLS_CERTIFICATE_PATH` | Empty | Client certificate path. |
| `DB_TLS_CA_CERTIFICATE_PATH` | Empty | Database CA certificate path. |

## Users and age restrictions
| Variable | Application default | Purpose |
| --- | --- | --- |
| `USERS_REQUIRE_EMAIL` | false | Require an email on registration. |
| `USERS_REQUIRE_FIRST_NAME` | false | Require a first name. |
| `USERS_REQUIRE_LAST_NAME` | false | Require a last name. |
| `USERS_REQUIRE_BIRTH_DATE` | false | Require a birth date; age restriction also requires it. |
| `PARENTAL_AGE_RESTRICTION_ENABLED` | false | Apply minimum-age restrictions to non-admin accounts. |
| `PARENTAL_AGE_OF_MAJORITY` | 18 | Age from which a user can change their own birth date. |

## Games and indexing
| Variable | Application default | Purpose |
| --- | --- | --- |
| `GAMES_INDEX_USE_POLLING` | false | Use polling rather than native filesystem events, useful for SMB/NFS. |
| `GAMES_INDEX_INTERVAL_IN_MINUTES` | 60 | Periodic full index interval. |
| `GAMES_SUPPORTED_FILE_FORMATS` | Built-in archive/executable list | Comma-separated supported extensions including a leading dot; see file structure. |
| `GAMES_SEARCH_RECURSIVE` | true | Scan subdirectories, including category folders. |
| `GAMES_SEARCH_EXCLUDE_FILE_REGEX` | Unset | JavaScript regular expression applied to file names. |
| `GAMES_SEARCH_EXCLUDE_DIR_REGEX` | Unset | JavaScript regular expression applied to directory names. |
| `GAMES_INDEX_CONCURRENCY` | 1 | Concurrent indexing operations. |
| `GAMES_DEFAULT_ARCHIVE_PASSWORD` | Anything | Default client extraction password; a game-specific archive_password can override it. |
| `GAMES_WINDOWS_SETUP_DEFAULT_INSTALL_PARAMETERS` | Built-in silent-install arguments | Default installer arguments supplied to clients; the backend never executes installers. |
| `GAMES_MAX_UPLOAD_SIZE` | 100gb | Maximum game upload size; zero disables this application limit. Align your outer proxy limit. |

## Media and saves
| Variable | Application default | Purpose |
| --- | --- | --- |
| `MEDIA_MAX_SIZE` | 10mb | Maximum uploaded/downloaded media size; zero disables the configured limit, while remote downloads retain a 64 MiB fallback. |
| `MEDIA_SUPPORTED_FORMATS` | Built-in MIME-type list | Comma-separated output/storage MIME types; see media documentation. |
| `MEDIA_GC_DISABLED` | false | Disable automatic removal of unreferenced media. |
| `MEDIA_GC_INTERVAL_IN_MINUTES` | 60 | Media cleanup interval. |
| `SAVEFILES_ENABLED` | false | Enable server save uploads/version management. |
| `SAVEFILES_MAX_SIZE` | 1gb | Maximum save upload size. |
| `SAVEFILES_MAX_SAVES` | 10 | Maximum retained save versions per configured grouping. |

## Metadata providers
| Variable | Application default | Purpose |
| --- | --- | --- |
| `METADATA_TTL_IN_DAYS` | 30 | Provider metadata refresh lifetime. |
| `METADATA_STEAM_ENABLED` | false | Enable Steam Store metadata. No API key is required. |
| `METADATA_STEAM_PRIORITY` | 5 | Steam contribution priority; higher-priority provider fields win. |
| `METADATA_STEAM_REQUEST_INTERVAL_MS` | 1000 | Interval between Steam requests in milliseconds. |
| `METADATA_IGDB_ENABLED` | true | Allow IGDB registration. The provider stays unavailable without both credentials. |
| `METADATA_IGDB_PRIORITY` | 10 | IGDB contribution priority. |
| `METADATA_IGDB_REQUEST_INTERVAL_MS` | 250 | IGDB request interval in milliseconds. |
| `METADATA_IGDB_CLIENT_ID` | Unset | Twitch developer application client ID. |
| `METADATA_IGDB_CLIENT_SECRET` | Unset | Confidential Twitch application client secret; supports _FILE. |

## Notifications and game metrics
| Variable | Application default | Purpose |
| --- | --- | --- |
| `NOTIFICATIONS_WEBHOOK_URL` | Unset | Optional HTTP(S) new/restored/changed-game notification destination. |
| `NOTIFICATIONS_WEBHOOK_TOKEN` | Unset | Optional Bearer token; supports _FILE. |
| `NOTIFICATIONS_WEBHOOK_FORMAT` | json | json or discord payload format. |
| `METRICS_ENABLED` | true | Collect authenticated completed download/install/uninstall/play events on this server. |
| `METRICS_RETENTION_DAYS` | 365 | Retained event lifetime in days; zero retains indefinitely. |

## Authentication
| Variable | Application default | Purpose |
| --- | --- | --- |
| `AUTH_SEED` | Random; Compose: persisted random key | Explicit signing seed, if supplied, requires at least 32 bytes of independent randomness. Supports _FILE. |
| `AUTH_SEED_PERSIST` | false; Compose: true | Persist the generated key privately in /config/auth-seed. Keep enabled in the supplied deployment. |
| `AUTH_ACCESS_TOKEN_EXPIRES_IN` | 5m | JWT access token lifetime. |
| `AUTH_REFRESH_TOKEN_EXPIRES_IN` | 30d | Refresh token lifetime. |
| `AUTH_API_KEY_ENABLED` | false | Enable API-key authentication for HTTP API requests. |
| `AUTH_BASIC_AUTH_ENABLED` | true | Enable Basic login and registration. |
| `AUTH_OAUTH2_ENABLED` | false | Enable configured OAuth2/SSO authentication. |
| `AUTH_OAUTH2_SCOPES` | openid,email,profile | Requested OAuth2 scopes. |
| `AUTH_OAUTH2_AUTH_URL` | Unset | Identity provider authorization endpoint. |
| `AUTH_OAUTH2_TOKEN_URL` | Unset | Identity provider token endpoint. |
| `AUTH_OAUTH2_CALLBACK_URL` | Unset | Public callback URL matching your identity-provider registration. |
| `AUTH_OAUTH2_USERINFO_URL` | Unset | Required trusted UserInfo endpoint; supplies the verified immutable identity subject. |
| `AUTH_OAUTH2_CLIENT_ID` | Unset | SSO application client ID. |
| `AUTH_OAUTH2_CLIENT_SECRET` | Unset | SSO application client secret; supports _FILE. |

## Development-only testing
| Variable | Application default | Purpose |
| --- | --- | --- |
| `TESTING_AUTHENTICATION_DISABLED` | false | Bypass authentication for isolated tests only. |
| `TESTING_MOCK_FILES` | false | Use mocked game files for tests. |
| `TESTING_IN_MEMORY_DB` | false | Use an in-memory test database. |
| `TESTING_MOCK_PROVIDERS` | false | Use mocked metadata providers for tests. |
| `TESTING_LOG_HTTP_TRAFFIC_ENABLED` | false | Verbose test HTTP logging. |

## Related behavior

- [First administrator, signup and SSO](user-management.md)
- [Indexing and exclusions](indexing.md), [packages/extras/addons](packages.md), and [folder tags](folder-tags.md)
- [Steam and IGDB configuration](metadata-enrichment/metadata.md)
- [Save versions](savefiles.md), [game metrics](metrics.md), and [chat](websockets.md)
- [Notifications](notifications.md) and [server diagnostics](admin-logs.md)

Game features do not require a subscription. Roles, activation, age and selected-user access restrictions still apply. The backend has no frontend-download or frontend-enable configuration; frontend updates use the separate service.
