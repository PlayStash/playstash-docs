---
sidebar_position: 7
---

# Older TrueNAS installations

Older TrueNAS application catalogs may contain a single-container upstream template. That template does not describe the current PlayStash deployment and should not be used for a new installation.

Use a Linux VM with Docker Engine and the Compose plugin, then follow [the PlayStash Compose guide](docker-compose.md). On a TrueNAS release supporting complete Compose projects, follow [the current TrueNAS page](truenas-scale.md) instead.

This documentation covers fresh PlayStash installations with PostgreSQL. It does not provide a conversion procedure for an existing upstream database or an old catalog deployment. Preserve independent backups before replacing any existing application.
