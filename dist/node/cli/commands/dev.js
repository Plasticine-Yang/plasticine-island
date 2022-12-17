"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDev = void 0;
function registerDev(cli) {
    cli.command('dev <root>', 'Start a dev server.').action((root) => {
        console.log(`dev: ${root}`);
    });
}
exports.registerDev = registerDev;
