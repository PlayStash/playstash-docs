---
sidebar_position: 6
---

# Login monitoring and proxy protection

Use your outer proxy's current logging and access/rate-limit controls.
Only an explicitly trusted proxy may supply client address/protocol headers.

Compose persists backend logs in data/logs. Records are structured and redact
credentials. Old text filters matching GET /api/users/me are not validated
current login-ban filters.

If using Fail2Ban, derive a filter from actual failed-login records and verify
it with fail2ban-regex. Ensure legitimate token expiry/health checks do not count
as password failures and the address is the client rather than the Docker gateway.

This repository does not supply a verified Fail2Ban jail. See
[administrator logs](../server-docs/admin-logs.md) and
[server setup](../server-docs/setup/setup.md).
