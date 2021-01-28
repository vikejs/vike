import {
  InputOptions,
  PluginContext,
  EmittedAsset,
  NormalizedOutputOptions,
  OutputBundle,
  PluginHooks,
} from "rollup";

type VitePlugin = Partial<PluginHooks> & { name: string };

export default ssr;

function ssr() {
  const plugin: VitePlugin = {
    name: "vite-ssr-plugin",
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
