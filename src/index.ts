import {
  InputOptions,
  PluginContext,
  EmittedAsset,
  NormalizedOutputOptions,
  OutputBundle,
  PluginHooks,
} from "rollup";
import { PageInstance } from "./types";
import { assert } from "./utils/assert";

export { PageConfig, addWindowType } from "./types";
export { renderToHtml };
export { getPage };
export { html } from "./html";
export { ssrPlugin };

import { userFiles } from "./userFiles";
import { getPageInstance } from "./getPageInstance";

async function getPage(url: string): Promise<PageInstance> {
  const pageInstance = getPageInstance(url);
  return {
    initialProps: { eqh: 1 },
    html() {
      return "ewuih";
    },
    view() {
      return "ewuih";
    },
    render() {
      return "ba";
    },
  };
}

type VitePlugin = Partial<PluginHooks> & { name: string };

function getDefaultHtml(scriptPaths: string[]): string {
  // TODO sanetize scriptPaths
  const scriptTags = scriptPaths.map((path) => {
    assert(path.startsWith("/"));
    return `  <script type="module" src="${path}" async></script>`;
  });
  return `<!DOCTYPE html>
<html>
 <head>
  <script type="module" src="/@vite/client"></script>
  <script type="module">
   import RefreshRuntime from "/@react-refresh";
   RefreshRuntime.injectIntoGlobalHook(window);
   window.$RefreshReg$ = () => {};
   window.$RefreshSig$ = () => (type) => type;
   window.__vite_plugin_react_preamble_installed__ = true;
  </script>
 </head>
 <body>
  <div id="react-root"></div>
${scriptTags}
 </body>
</html>`;
}
async function renderToHtml(): Promise<string> {
  let html = getDefaultHtml([]);
  return html;
}

function ssrPlugin() {
  const plugin: VitePlugin = {
    name: "vite-plugin-ssr",
    options,
    generateBundle,
  };
  return plugin;
}

function options(inputOptions: InputOptions) {
  console.log(inputOptions);
  // inputOptions.input = "<div>abc</div>";
  // throw new Error("ewuqh");
  return null;
}

async function generateBundle(
  this: PluginContext,
  output: NormalizedOutputOptions,
  bundle: OutputBundle
) {
  const source = "<html>178</html>";

  console.log(98);
  const htmlFile: EmittedAsset = {
    type: "asset",
    source,
    name: "Rollup HTML Asset",
    fileName: "index.html",
  };

  this.emitFile(htmlFile);
}
