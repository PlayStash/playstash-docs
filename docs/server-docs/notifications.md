---
sidebar_position: 13.5
---

# Optional library notifications

No webhook or external notification account is configured by default. To send a notification when a game is added, restored or its release file changes, configure your own destination under `playstash-backend.environment`:

```yaml
NOTIFICATIONS_WEBHOOK_URL: "https://your-webhook.example/events"
NOTIFICATIONS_WEBHOOK_FORMAT: "json"
```

Keep the existing settings and run `docker compose up -d`. `json` sends game ID, title, version and timestamp; `discord` produces a Discord-compatible webhook payload. `NOTIFICATIONS_WEBHOOK_TOKEN` optionally adds a Bearer token. Both URL and token support the `_FILE` secrets mechanism and are redacted from the configuration API.

The destination must be HTTP(S) without embedded URL credentials. A deliberately configured private-network webhook is allowed. Requests reject redirects and use short timeouts, a bounded queue and temporary-failure retries. Notification failure does not fail an upload or library scan.

Unchanged scans do not repeat notifications, and restricted games are omitted. These events go to the operator's configured destination; they are separate from client consent-based usage analytics and the installation's authenticated [game metrics](metrics.md).
