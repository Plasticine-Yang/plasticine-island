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

// src/vite-plugins/load-index-html.ts
import { readFile } from "fs/promises";
function viteLoadIndexHtmlPlugin(templatePath) {
  return {
    name: "plasticine-island:load-index-html",
    configureServer(server) {
      server.middlewares.use(async (_, res) => {
        const html = await readFile(templatePath, { encoding: "utf-8" });
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    }
  };
}

// src/constants/index.ts
import { resolve } from "path";
var PACKAGE_ROOT = resolve(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = resolve(PACKAGE_ROOT, "index.html");

// src/node/core/dev.ts
async function createDevServer(root) {
  const server = await createServer({
    configFile: false,
    root,
    plugins: [viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH)]
  });
  return server;
}

// src/node/cli/commands/dev.ts
function registerDev(cli) {
  const action = async (root) => {
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  };
  cli.command("dev <root>", "Start a dev server.").action(action);
}

// src/node/cli/commands/build.ts
function registerBuild(cli) {
  cli.command("build <root>", "Build for production.").action((root) => {
    console.log(`build: ${root}`);
  });
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
