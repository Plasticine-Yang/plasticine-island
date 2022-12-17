"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServer = void 0;
const vite_1 = require("vite");
async function createDevServer(root) {
    const server = await (0, vite_1.createServer)({
        configFile: false,
        root,
    });
    return server;
}
exports.createDevServer = createDevServer;
