---
sidebar_position: 9.5
---

# Backend plugins

Plugins are compiled NestJS modules loaded into the backend process. They execute with the backend's permissions, so install trusted, compatible code and keep a backup before changing plugins.

## Install

1. Obtain a compiled plugin compatible with the current PlayStash backend.
2. Extract its folder into `data/plugins/` beside the supplied Compose file (the backend mounts it as `/plugins`). Preserve its ordinary JavaScript files and relative imports; an archive itself is not a plugin entry point.
3. Restart or recreate the backend. The loader discovers files ending in `.plugin.module.js` and imports their default-exported module classes.
4. Inspect `docker compose logs --tail=100 playstash-backend` for loading errors.

The plugin folder belongs only to the backend; do not put plugins in the frontend container. Review compatibility when updating the backend. The loader reports failures in logs rather than installing missing dependencies on the server.

## Develop

Use the current [example plugins repository](https://github.com/PlayStash/playstash-backend-example-plugins) and backend [development instructions](https://github.com/PlayStash/playstash-backend/blob/main/INSTALL.md). The source repositories are private and require GitHub access.

A plugin default-exports a NestJS module class implementing `PlayStashPluginModule`. Its metadata implements `PlayStashPluginModuleMetadataV1`; both interfaces are defined in [src/globals.ts](https://github.com/PlayStash/playstash-backend/blob/main/src/globals.ts). Metadata includes its name, author and optional version, description, website, license, keywords and plugin dependencies.

The backend uses ESM/NodeNext. Use explicit `.js` extensions for relative imports and `import type` for interfaces. Do not bundle another copy of NestJS or `reflect-metadata`. Build/test the plugin with the matching backend dependency graph; the compiled output must retain imports that resolve from its deployed location. See the example repository for a working layout rather than copying an old upstream plugin binary.

Namespaced environment settings can be read through `process.env`, for example `PLUGIN_AUTHOR_PLUGIN_FEATURE`. Document each setting and include a README and license when sharing the plugin. Keep endpoints authenticated unless their public behavior is intentional.

## Metadata providers

A provider plugin implements the backend's [abstract provider service](https://github.com/PlayStash/playstash-backend/blob/main/src/modules/metadata/providers/abstract.metadata-provider.service.ts) and registers its service with the metadata framework. See [metadata enrichment](metadata-enrichment/metadata.md) for the built-in Steam/IGDB providers and merge priorities. There is no automatic subscription or third-party account requirement for plugin loading.
