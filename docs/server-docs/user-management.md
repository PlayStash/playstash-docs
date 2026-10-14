---
sidebar_position: 6
---

# Users, signup and administrator access

## First login

After `docker compose up -d`, open the frontend at `http://SERVER-IP:8080` or your configured HTTPS hostname. Choose registration and create your own username/password. With the supplied fresh-install Compose, **the first successfully registered account becomes an active administrator**. There is no predefined login and the server does not create an account for you.

Finish that first registration before giving other people access to the instance. Subsequent Basic registrations receive the User role and require administrator activation by default. If you deliberately configure `SERVER_ADMIN_USERNAME`, that reserved name changes bootstrap behavior: its registration requires the matching `SERVER_ADMIN_PASSWORD` and cannot be claimed by another person.

## Manage accounts

Open **Administration** to activate/deactivate users and edit their roles. Administrators can create, edit, delete and recover accounts. Deactivation applies to **every role, including Admin**: it blocks sign-in, issued tokens, API keys/download tokens and live activity/chat access. A configured recovery administrator is reactivated on backend startup.

| Role | Level | Main permissions |
| --- | --- | --- |
| Guest | 0 | View permitted library content. |
| User | 1 | Download permitted games, keep progress/bookmarks and edit their own profile. |
| Editor | 2 | Edit and remap game metadata. |
| Admin | 3 | Manage users, game uploads/deletion, server settings, diagnostics and backups. |

All accounts still obey activation. Age and selected-user restrictions apply to non-admin library access. Features require no paid subscription.

## Disable public signup

Create the first administrator **before** disabling self-registration. Add this under the existing backend environment block:

```yaml
services:
  playstash-backend:
    environment:
      SERVER_REGISTRATION_DISABLED: "true"
```

Keep the other Compose entries, then run `docker compose up -d`. This blocks Basic public self-registration; authenticated administrators retain account creation. It does not disable existing logins. OAuth2/SSO account provisioning is separate, so review identity-provider access if SSO is enabled.

Leave `SERVER_ACCOUNT_ACTIVATION_DISABLED=false` for manual activation of subsequent users. Set it to `true` only if you want new accounts activated automatically.

## Administrator recovery

For an **existing** account, temporarily add `SERVER_ADMIN_USERNAME` to promote/reactivate it on startup. Add `SERVER_ADMIN_PASSWORD` as well to reset that account's password. Use a newly chosen password rather than a documented example; `_FILE` can supply it from a private mounted secret. Recreate the backend with `docker compose up -d`, then remove the recovery password and recreate again after regaining access.

Neither setting creates a new account. While a configured recovery administrator remains selected, startup continues to promote and activate that account. Protect server configuration and its secrets accordingly.

## SSO and authentication storage

OAuth2 requires your own authorization/token/UserInfo endpoints, client ID/secret and public callback URL. See [authentication configuration](configuration.md#authentication). Identity is bound to the trusted provider's immutable subject. A same-name/email local account is not automatically linked to an SSO identity.

The Compose setup persists a separate random authentication key in `data/config/auth-seed`; preserve it with your database backups. Explicit `AUTH_SEED`/`AUTH_SEED_FILE` takes precedence and requires at least 32 bytes of independent randomness. Replacing a signing key invalidates existing tokens. Use [the trusted HTTPS proxy configuration](setup/reverse-proxy.md) for production access.
