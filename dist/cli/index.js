import {
  __dirname,
  resolveConfig
} from "../chunk-QXXSS64M.js";

// src/node/cli/index.ts
import cac from "cac";

// src/node/core/dev.ts
import { createServer } from "vite";
import viteReactPlugin from "@vitejs/plugin-react";

// src/vite-plugins/load-index-html.ts
import { readFile } from "fs/promises";

// src/constants/index.ts
import { resolve } from "path";
var PACKAGE_ROOT = resolve(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = resolve(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = resolve(
  PACKAGE_ROOT,
  "src/runtime/client-entry/index.tsx"
);
var SERVER_ENTRY_PATH = resolve(
  PACKAGE_ROOT,
  "src/runtime/server-entry/index.tsx"
);
var CLIENT_ENTRY_BUNDLE_PATH = "dist";
var SERVER_ENTRY_BUNDLE_PATH = ".temp";

// src/vite-plugins/load-index-html.ts
function viteLoadIndexHtmlPlugin(templatePath) {
  return {
    name: "plasticine-island:load-index-html",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(templatePath, { encoding: "utf-8" });
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (error) {
            return next(error);
          }
        });
      };
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    }
  };
}

// src/vite-plugins/resolve-config.ts
import { relative } from "path";
var siteDataId = "plasticine-island:site-data";
var resolvedSiteDataId = "\0plasticine-island:site-data";
function viteResolveConfigPlugin(config, onHotUpdate) {
  const { root, siteData, sources } = config;
  return {
    name: "plasticine-island:config",
    resolveId(source) {
      if (source === siteDataId) {
        return resolvedSiteDataId;
      }
    },
    load(id) {
      if (id === resolvedSiteDataId) {
        return `export default ${JSON.stringify(siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const shouldHotUpdate = (file) => sources.some((configFilePath) => file.includes(configFilePath));
      if (shouldHotUpdate(ctx.file)) {
        console.log(
          `
${relative(root, ctx.file)} changed, restarting dev server...
`
        );
        await onHotUpdate();
      }
    }
  };
}

// src/vite-plugins/conventional-routes/route-service.ts
import fg from "fast-glob";
import { relative as relative2 } from "path";
import { normalizePath } from "vite";
var RouteService = class {
  #scanDir;
  #routeMeta = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  init() {
    const files = fg.sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "plasticine-island.config.ts",
        "plasticine-island.config.js"
      ]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative2(this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeMeta.push({
        fileAbsPath: file,
        routePath
      });
    });
  }
  getRouteMeta() {
    return this.#routeMeta;
  }
  normalizeRoutePath(rawPath) {
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  generateRoutesCode() {
    return `
import React from 'react'   
import loadable from '@loadable/component'

// \u8DEF\u7531\u7EC4\u4EF6
${this.#routeMeta.map((route, index) => {
      return `const Route${index} = loadable(() => import('${route.fileAbsPath}'))`;
    }).join("\n")}

// routes \u5BF9\u8C61
export const routes = [
${this.#routeMeta.map((route, index) => {
      return `  { path: '${route.routePath}', element: React.createElement(Route${index}) }`;
    }).join(",\n")}
]
`.trim();
  }
};

// src/vite-plugins/conventional-routes/index.ts
var conventionalRoutesId = "plasticine-island:conventional-routes";
var resolvedConventionalRoutesId = "\0plasticine-island:conventional-routes";
function viteConventionalRoutesPlugin(config) {
  const { root } = config;
  const routeServices = new RouteService(root);
  return {
    name: conventionalRoutesId,
    configResolved() {
      routeServices.init();
    },
    resolveId(source) {
      if (source === conventionalRoutesId) {
        return resolvedConventionalRoutesId;
      }
    },
    load(id) {
      if (id === resolvedConventionalRoutesId) {
        return routeServices.generateRoutesCode();
      }
    }
  };
}

// src/node/core/dev.ts
async function createDevServer(root, onHotUpdate) {
  const config = await resolveConfig(root);
  const server = await createServer({
    configFile: false,
    root: PACKAGE_ROOT,
    plugins: [
      viteReactPlugin(),
      viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH),
      viteResolveConfigPlugin(config, onHotUpdate),
      viteConventionalRoutesPlugin({ root })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
  return server;
}

// src/node/cli/commands/dev.ts
function registerDev(cli) {
  const actionCallback = async (root) => {
    const _createDevServer = async () => {
      const server = await createDevServer(root, async () => {
        await server.close();
        await _createDevServer();
      });
      await server.listen();
      server.printUrls();
    };
    await _createDevServer();
  };
  cli.command("dev <root>", "Start a dev server.").action(actionCallback);
}

// src/node/cli/commands/build.ts
import { resolve as resolve3 } from "path";

// src/node/core/build.ts
import { build as viteBuild } from "vite";
import viteReactPlugin2 from "@vitejs/plugin-react";
import { resolve as resolve2 } from "path";
import { rm, writeFile } from "fs/promises";
async function build(root, config) {
  const [clientBundle] = await bundle(root, config);
  const serverEntryBundlePath = resolve2(root, ".temp", "index.js");
  const serverEntryModule = await import(serverEntryBundlePath);
  const { serverRender } = serverEntryModule;
  await renderPage(root, serverRender, clientBundle);
}
async function bundle(root, config) {
  const resolveViteConfig = (type) => {
    const isServer = type === "server";
    return {
      mode: "production",
      root,
      plugins: [
        viteReactPlugin2(),
        viteResolveConfigPlugin(config),
        viteConventionalRoutesPlugin({ root })
      ],
      build: {
        ssr: isServer,
        outDir: isServer ? SERVER_ENTRY_BUNDLE_PATH : CLIENT_ENTRY_BUNDLE_PATH,
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: "esm"
          }
        }
      }
    };
  };
  const buildClientEntry = () => {
    return viteBuild(resolveViteConfig("client"));
  };
  const buildServerEntry = () => {
    return viteBuild(resolveViteConfig("server"));
  };
  try {
    const [clientEntryBundle, serverEntryBundle] = await Promise.all([
      buildClientEntry(),
      buildServerEntry()
    ]);
    return [clientEntryBundle, serverEntryBundle];
  } catch (error) {
    console.error("build error:", error);
  }
}
async function renderPage(root, serverRender, clientBundle) {
  const appHTML = serverRender();
  const clientChunkEntry = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>plasticine-island</title>
  </head>
  <body>
    <div id="root">${appHTML}</div>
    <script type="module" src="/${clientChunkEntry.fileName}"><\/script>
  </body>
</html> 
`.trim();
  await writeFile(resolve2(root, CLIENT_ENTRY_BUNDLE_PATH, "index.html"), html);
  await rm(resolve2(root, SERVER_ENTRY_BUNDLE_PATH), {
    recursive: true,
    force: true
  });
}

// src/node/cli/commands/build.ts
function registerBuild(cli) {
  const actionCallback = async (root) => {
    try {
      const resolvedRoot = resolve3(root);
      const config = await resolveConfig(resolvedRoot);
      await build(root, config);
    } catch (error) {
      console.error("build command action error:", error);
    }
  };
  cli.command("build <root>", "Build for production.").action(actionCallback);
}

// src/node/cli/commands/index.ts
function registerCommands(cli) {
  registerDev(cli);
  registerBuild(cli);
}

// src/node/cli/index.ts
var setupCLI = () => {
  const cli = cac("plasticine-island");
  registerCommands(cli);
  cli.help();
  cli.version("1.0.0");
  cli.parse();
};
setupCLI();
