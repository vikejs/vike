import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageConfig, html } from "vite-plugin-ssr";

const pageConfig: PageConfig = {
  render() {
    const viewElement = React.createElement(this.view, this.initialProps);
    const viewHtml = ReactDOMServer.renderToString(viewElement);
    return viewHtml;
  },
  html({title}) {
    return html(require.resolve("./index.html"), {
      title,
      viewHtml: this.viewHtml,
    });
  },
};

export default pageConfig;
