import type { Plugin } from "vite";

export default importBuild;
export { importBuild };

type PluginConfig = {
  srcAll: string[];
  isInstalled?: true;
};

// Return type `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function importBuild(src: string): any {
  const pluginConfig = getPluginConfig(src);
  if (pluginConfig.isInstalled) {
    const randomId = Math.random().toString().slice(2);
    // Return a plugin that does nothing
    return {
      name: "vite-plugin-import-build:dummy-" + randomId,
    };
  }
  pluginConfig.isInstalled = true;
  let ssr: boolean;
  const plugin: Plugin = {
    name: "vite-plugin-import-build",
    apply: "build",
    configResolved(config) {
      ssr = isSSR(config);
    },
    generateBundle() {
      if (!ssr) return;
      const source = [getPreamble(), ...pluginConfig.srcAll].join("\n\n");
      this.emitFile({
        fileName: `importBuild.js`,
        type: "asset",
        source,
      });
    },
  }
  return plugin;
}

function getPreamble(): string {
  return `// Load this file if your server code is bundled. For example:
//  - Cloudflare Workers needs the entire worker code to be bundled into a single file.
//  - Vercel bundles serverless functions behind the scenes.

// The path of following dependencies are normally determined dynamically at run-time; this file makes these dependencies discoverable at build-time so that bundlers are able to determine the entire dependency tree.
`;
}

const configKey = "__vite-plugin-import-build:config";
declare global {
  namespace NodeJS {
    interface Global {
      [configKey]?: PluginConfig;
    }
  }
}
function getPluginConfig(src: string): PluginConfig {
  const pluginConfig = global[configKey] = global[configKey] || { srcAll: [] };
  if (!pluginConfig.srcAll.includes(src)) {
    pluginConfig.srcAll.push(src);
  }
  return pluginConfig;
}

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr;
}
