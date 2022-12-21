import { j as jsx } from "../index.js";
import "react/jsx-runtime";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "react-router-dom";
import "react";
import "@loadable/component";
const A = () => {
  return /* @__PURE__ */ jsx("div", { children: "Hello, route A" });
};
export {
  A as default
};
