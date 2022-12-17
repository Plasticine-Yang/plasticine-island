"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDev = void 0;
const core_1 = require("../../core");
function registerDev(cli) {
    const action = async (root) => {
        const server = await (0, core_1.createDevServer)(root);
        server.listen();
        server.printUrls();
    };
    cli.command('dev <root>', 'Start a dev server.').action(action);
}
exports.registerDev = registerDev;
