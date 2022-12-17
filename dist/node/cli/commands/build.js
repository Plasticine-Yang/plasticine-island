"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBuild = void 0;
function registerBuild(cli) {
    cli
        .command('build <root>', 'Build for production.')
        .action((root) => {
        console.log(`build: ${root}`);
    });
}
exports.registerBuild = registerBuild;
