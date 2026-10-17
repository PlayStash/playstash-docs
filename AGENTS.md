# PlayStash documentation

Keep documentation aligned with the current PlayStash repositories and their
published deployment. Read the relevant implementation before documenting a
setting, UI label or behavior. Never present upstream screenshots, subscription
requirements, old registry names or removed configuration as current PlayStash.

- Document user-facing changes in `CHANGELOG.md` under the current version.
- Stable and development branches are `main` and `dev`; keep both synchronized
  when publishing documentation. Do not create extra remote branches.
- This documentation repository is public; main publishes the website to GitHub
  Pages at https://playstash.github.io/playstash-docs/. Frontend and backend
  source repositories and their published releases are public; the other
  PlayStash repositories remain private. Container package visibility is
  configured separately from source repository visibility.
- Production uses PostgreSQL and separate frontend/API containers in one Compose.
- Provider credentials belong to the backend. `.env` values reach a container
  only when the Compose file references or passes them.
- All library features are available without a paid subscription; authorization
  and privacy restrictions remain in effect.
- Preserve original author attribution, `LICENSE`, and third-party notices.
- GitHub-hosted documentation checks, artifact builds and the Pages deployment
  from main run normally. Any future self-hosted job must require
  `vars.PLAYSTASH_RUN_SELF_HOSTED == 'true'` and the repository variable defaults
  to `false`.
- Run a production documentation build with broken-link errors enabled, the
  complete dependency audit and the declared documentation checks before push.
  Do not add other public hosting without an explicit hosting request.
