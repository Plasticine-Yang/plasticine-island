// src/node/cli/index.ts
import cac from "cac";

// src/node/core/dev.ts
import { createServer } from "vite";
async function createDevServer(root) {
  const server = await createServer({
    configFile: false,
    root
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
