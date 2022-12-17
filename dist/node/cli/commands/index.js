"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const dev_1 = require("./dev");
const build_1 = require("./build");
function registerCommands(cli) {
    (0, dev_1.registerDev)(cli);
    (0, build_1.registerBuild)(cli);
}
exports.registerCommands = registerCommands;
