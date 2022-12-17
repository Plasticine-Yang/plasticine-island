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
var import_vite = require("vite");

// src/vite-plugins/load-index-html.ts
var import_promises = require("fs/promises");
function viteLoadIndexHtmlPlugin(templatePath) {
  return {
    name: "plasticine-island:load-index-html",
    configureServer(server) {
      server.middlewares.use(async (_, res) => {
        const html = await (0, import_promises.readFile)(templatePath, { encoding: "utf-8" });
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    }
  };
}

// src/constants/index.ts
var import_path = require("path");
var PACKAGE_ROOT = (0, import_path.resolve)(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = (0, import_path.resolve)(PACKAGE_ROOT, "index.html");

// src/node/core/dev.ts
async function createDevServer(root) {
  const server = await (0, import_vite.createServer)({
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
  const cli = (0, import_cac.default)("plasticine-island");
  registerCommands(cli);
  cli.help();
  cli.version("1.0.0");
  cli.parse();
};
setupCLI();
