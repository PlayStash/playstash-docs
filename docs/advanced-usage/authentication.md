---
sidebar_position: 1
---

# Authentication

The standard installation enables Basic login. First registration on an empty
server creates an active administrator; later accounts need activation.
SERVER_REGISTRATION_DISABLED=true stops Basic self-registration after setup.
SSO provisioning is independent of that setting.

## Keys and activation

AUTH_SEED_PERSIST=true is set by the supplied Compose. The backend generates and
privately reuses data/config/auth-seed. Explicit AUTH_SEED or AUTH_SEED_FILE takes
precedence and requires at least 32 bytes of independent randomness.

Deactivation blocks every role from sign-in, existing access/refresh tokens,
API keys and issued download tokens and disconnects activity/chat sessions.
A configured SERVER_ADMIN_USERNAME is recovered and activated on startup.
Registering that reserved name requires SERVER_ADMIN_PASSWORD.

## OAuth2 / SSO

Configure authorization, token and authenticated UserInfo endpoints and credentials
under playstash-backend.environment:

```yaml
      AUTH_OAUTH2_ENABLED: "true"
      AUTH_OAUTH2_AUTH_URL: "https://YOUR-PROVIDER/authorize"
      AUTH_OAUTH2_TOKEN_URL: "https://YOUR-PROVIDER/token"
      AUTH_OAUTH2_USERINFO_URL: "https://YOUR-PROVIDER/userinfo"
      AUTH_OAUTH2_CLIENT_ID: "YOUR_CLIENT_ID"
      AUTH_OAUTH2_CLIENT_SECRET: "YOUR_CLIENT_SECRET"
      AUTH_OAUTH2_CALLBACK_URL: "https://YOUR-SERVER/api/auth/oauth2/login"
```

Use HTTPS endpoints and the public frontend hostname. Scopes default to openid,
email and profile. Keep credentials out of committed files; mounted secrets
can use corresponding _FILE keys.

Identity comes from the configured UserInfo endpoint and is bound to its immutable
subject. Existing local usernames/emails are not automatically linked.
Cookie-based cross-origin clients require exact SERVER_CORS_ALLOWED_ORIGINS.
The supplied same-origin frontend does not need permissive CORS.

## API clients

Use /api/docs for the live contract. Basic login returns access/refresh tokens;
defaults are five minutes and 30 days. API-key authentication is configurable.
Browser Socket.IO clients use the handshake auth object, not query-string keys.
See [WebSockets](../server-docs/websockets.md).

HTTPS cookie behavior requires correctly configured trusted outer-proxy headers.
See [server setup](../server-docs/setup/setup.md).
