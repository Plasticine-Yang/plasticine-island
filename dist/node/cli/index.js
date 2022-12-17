"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const commands_1 = require("./commands");
const setupCLI = () => {
    const cli = (0, cac_1.default)('plasticine-island');
    (0, commands_1.registerCommands)(cli);
    cli.help();
    cli.version('1.0.0');
    cli.parse();
};
setupCLI();
