// node_modules/.pnpm/tsup@6.5.0_typescript@4.9.4/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

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

// src/node/core/dev.ts
async function createDevServer(root) {
  const server = await createServer({
    configFile: false,
    root,
    plugins: [
      viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH),
      viteReactPlugin()
    ]
  });
  return server;
}

// src/node/cli/commands/dev.ts
function registerDev(cli) {
  const actionCallback = async (root) => {
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  };
  cli.command("dev <root>", "Start a dev server.").action(actionCallback);
}

// src/node/core/build.ts
import { build as viteBuild } from "vite";
import { resolve as resolve2 } from "path";
import { rm, writeFile } from "fs/promises";
async function build(root) {
  const [clientBundle] = await bundle(root);
  const serverEntryBundlePath = resolve2(root, ".temp", "index.js");
  const serverEntryModule = await import(serverEntryBundlePath);
  const { serverRender } = serverEntryModule;
  await renderPage(root, serverRender, clientBundle);
}
async function bundle(root) {
  const resolveViteConfig = (type) => {
    const isServer = type === "server";
    const config = {
      mode: "production",
      root,
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
    return config;
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
    await build(root);
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
