---
sidebar_position: 7.5
---

# Backup and restore

Production uses PostgreSQL. Back up both the database and the files it references; a database dump alone does not contain game packages, covers or saves.

## Complete installation backup

For a consistent filesystem backup, stop the stack from the installation directory:

```sh
docker compose stop
```

Copy `docker-compose.yml`, any local `.env`, **all of `data/`**, and `games/` to your backup location while the services are stopped. Preserve file ownership and permissions. In particular, keep `data/postgres/`, `data/secrets/postgres-password` and `data/config/auth-seed` together. Then resume the same containers:

```sh
docker compose start
```

A copy of a running PostgreSQL data directory is not a consistent cold backup. Keep an independent backup on other storage and verify your restore procedure. For a complete cold restore, stop the destination stack, restore the matching files/directories with their permissions into the installation directory, and start with the compatible pinned images. Do not replace a running database directory.

## Database dump in the client

An administrator can open **Administration → Backup & Restore Database → Backup**, enter the **Database Password**, and select **Start Backup**. In the supplied Compose this is the generated private value stored in `data/secrets/postgres-password`; it is not the user's login password.

The downloaded dump is unencrypted and can contain private library/user data. Store it privately. Preserve a separate copy of media, saves, configuration, secrets and game files for the same point in time.

## Restore a database dump

Open **Administration → Backup & Restore Database → Restore**, choose **Backup File**, provide the current **Database Password**, and select **Start Restore**. This replaces the current database contents. Make a fresh backup before restoring and use a dump from the same database technology and a compatible PlayStash/PostgreSQL version.

The PostgreSQL 16 deployment uses version-16 `pg_dump`/`pg_restore` tools. The backend creates a private pre-restore dump before modifying the database. If the uploaded dump cannot be restored, it reports an error and attempts to restore the original data. If that recovery also fails, the pre-restore snapshot remains under `data/db/playstash-restore-*/` for manual recovery; check the server logs. Do not assume an error response means the upload was successfully applied.

## API

Both endpoints require authenticated Admin access **and** `X-Database-Password` with the current database password:

- `GET /api/admin/database/backup`: create/download a database dump.
- `POST /api/admin/database/restore`: multipart upload using field `file`.

Use HTTPS for remote administration. API descriptions are available at `/api/docs`. Fresh production installation is PostgreSQL; this guide does not convert an old upstream database.

Chat history lives only in backend memory and disappears on restart. It is not included in a database or filesystem backup. See [chat retention](websockets.md).
