var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/node/cli/index.ts
var import_cac = __toESM(require("cac"), 1);

// src/node/core/dev.ts
var import_vite2 = require("vite");
var import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);

// src/vite-plugins/load-index-html.ts
var import_promises = require("fs/promises");

// src/constants/index.ts
var import_path = require("path");
var PACKAGE_ROOT = (0, import_path.resolve)(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = (0, import_path.resolve)(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = (0, import_path.resolve)(
  PACKAGE_ROOT,
  "src/runtime/client-entry/index.tsx"
);
var SERVER_ENTRY_PATH = (0, import_path.resolve)(
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
          let html = await (0, import_promises.readFile)(templatePath, { encoding: "utf-8" });
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
var import_path2 = require("path");
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
${(0, import_path2.relative)(root, ctx.file)} changed, restarting dev server...
`
        );
        await onHotUpdate();
      }
    }
  };
}

// src/vite-plugins/conventional-routes/route-service.ts
var import_fast_glob = __toESM(require("fast-glob"), 1);
var import_path3 = require("path");
var import_vite = require("vite");
var RouteService = class {
  #scanDir;
  #routeMeta = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  init() {
    const files = import_fast_glob.default.sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
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
      const fileRelativePath = (0, import_vite.normalizePath)((0, import_path3.relative)(this.#scanDir, file));
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

// src/node/core/config-resolver.ts
var import_unconfig = require("unconfig");
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
  return (0, import_unconfig.loadConfig)({
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

// src/node/core/dev.ts
async function createDevServer(root, onHotUpdate) {
  const config = await resolveConfig(root);
  const server = await (0, import_vite2.createServer)({
    configFile: false,
    root: PACKAGE_ROOT,
    plugins: [
      (0, import_plugin_react.default)(),
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
var import_path5 = require("path");

// src/node/core/build.ts
var import_vite3 = require("vite");
var import_plugin_react2 = __toESM(require("@vitejs/plugin-react"), 1);
var import_path4 = require("path");
var import_promises2 = require("fs/promises");
async function build(root, config) {
  const [clientBundle] = await bundle(root, config);
  const serverEntryBundlePath = (0, import_path4.resolve)(root, ".temp", "index.js");
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
        (0, import_plugin_react2.default)(),
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
    return (0, import_vite3.build)(resolveViteConfig("client"));
  };
  const buildServerEntry = () => {
    return (0, import_vite3.build)(resolveViteConfig("server"));
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
  await (0, import_promises2.writeFile)((0, import_path4.resolve)(root, CLIENT_ENTRY_BUNDLE_PATH, "index.html"), html);
  await (0, import_promises2.rm)((0, import_path4.resolve)(root, SERVER_ENTRY_BUNDLE_PATH), {
    recursive: true,
    force: true
  });
}

// src/node/cli/commands/build.ts
function registerBuild(cli) {
  const actionCallback = async (root) => {
    try {
      const resolvedRoot = (0, import_path5.resolve)(root);
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
  const cli = (0, import_cac.default)("plasticine-island");
  registerCommands(cli);
  cli.help();
  cli.version("1.0.0");
  cli.parse();
};
setupCLI();
