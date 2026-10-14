# PlayStash documentation

Keep documentation aligned with the current PlayStash repositories and their
published deployment. Read the relevant implementation before documenting a
setting, UI label or behavior. Never present upstream screenshots, subscription
requirements, old registry names or removed configuration as current PlayStash.

- Document user-facing changes in `CHANGELOG.md` under the current version.
- Stable and development branches are `main` and `dev`; keep both synchronized
  when publishing documentation. Do not create extra remote branches.
- The source repository is private. Public container downloads do not make source
  code, private releases or a documentation website public.
- Production uses PostgreSQL and separate frontend/API containers in one Compose.
- Provider credentials belong to the backend. `.env` values reach a container
  only when the Compose file references or passes them.
- All library features are available without a paid subscription; authorization
  and privacy restrictions remain in effect.
- Preserve original author attribution, `LICENSE`, and third-party notices.
- GitHub-hosted documentation checks and artifact builds run normally. Any future
  self-hosted job must require `vars.PLAYSTASH_RUN_SELF_HOSTED == 'true'` and the
  repository variable defaults to `false`.
- Run a production documentation build with broken-link errors enabled, the
  complete dependency audit and the declared documentation checks before push.
  Do not deploy a public website without an explicit hosting request.
