// node_modules/.pnpm/tsup@6.5.0_typescript@4.9.4/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/core/config-resolver.ts
import { loadConfig } from "unconfig";
async function resolveConfig(root) {
  const { config: userConfig, sources } = await resolveUserConfig(root);
  const siteConfig = {
    root,
    sources,
    siteData: resolveSiteData(userConfig)
  };
  return siteConfig;
}
function resolveUserConfig(root) {
  return loadConfig({
    sources: [
      {
        files: "plasticine-island.config",
        extensions: ["ts", "js"]
      }
    ],
    cwd: root
  });
}
function resolveSiteData(userConfig) {
  const { title, description } = userConfig;
  return {
    title: title ?? "plasticine-island",
    description: description ?? "A SSG framework powered by island"
  };
}
function defineConfig(config) {
  return config;
}

export {
  __dirname,
  resolveConfig,
  defineConfig
};
