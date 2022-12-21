import * as jsxRuntime from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useRoutes } from "react-router-dom";
import React from "react";
import loadable from "@loadable/component";
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
const Route0 = loadable(() => import("./assets/Bar-beb8a4cd.js"));
const Route1 = loadable(() => import("./assets/Foo-cc5973ce.js"));
const Route2 = loadable(() => import("./assets/Index-c2c56ac8.js"));
const routes = [
  { path: "/Bar", element: React.createElement(Route0) },
  { path: "/guide/Foo", element: React.createElement(Route1) },
  { path: "/guide/Index", element: React.createElement(Route2) }
];
const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
const Layout = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Common Content" }),
    /* @__PURE__ */ jsx("h1", { children: "Doc Content" }),
    /* @__PURE__ */ jsx(Content, {})
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsx(Layout, {});
};
function serverRender() {
  return renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: "/guide", children: /* @__PURE__ */ jsx(App, {}) })
  );
}
export {
  jsx as j,
  serverRender
};
