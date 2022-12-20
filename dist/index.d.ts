/** @description config type declaration of plasticine-island.config */
interface UserConfig {
    title?: string;
    description?: string;
}

/** @description 配置解析器 */

declare function defineConfig(config: UserConfig): UserConfig;

export { defineConfig };
