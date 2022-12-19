/** @description config type declaration of plasticine-island.config */

export interface UserConfig {
  title?: string
  description?: string
}

export interface SiteConfig {
  root: string

  /** @description 配置文件的路径 */
  sources: string[]

  siteData: UserConfig
}
