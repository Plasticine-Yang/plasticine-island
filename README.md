# plasticine-island

A SSG framework powered by island.

## Features

- [x] vite 插件 -- 为开发服务器加载模板 html 作为入口，并自动添加 script 标签加载客户端运行时入口代码
- [x] SSR 构建流程支持
- [x] vite 插件 -- 支持配置文件 `plasticine-island.config.ts` 热更新
- [x] vite 插件 -- 约定式路由
- [x] rehype 插件 -- 转换 markdown 的代码块为特定 html 结构

## Usage

### dev

```shell
pnpm dev
node bin/plasticine-island dev docs
```

访问 `http://localhost:5173`

### build

```shell
pnpm build
node bin/plasticine-island build docs
pnpm preview
```

访问 `http://localhost:3000`
