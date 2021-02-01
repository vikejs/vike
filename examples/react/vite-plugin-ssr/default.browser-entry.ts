import ReactDOM from "react-dom";
import React from "react";
import { addWindowType } from "vite-plugin-ssr/client";

addWindowType(window);
const { page } = window.vitePluginSsr;

const app = React.createElement(page.view, page.initialProps);
//@ts-ignore
ReactDOM.hydrate(app, document.getElementById("page-view"));
