export { runPageConfigCallbacks }
export { clearPageConfigCallbacks }
export type { OnPageConfigs }
export type { PageConfigCallbackContext }

import type { Environment } from 'vite'
import type { Config } from '../../../../types/Config.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import '../../assertEnvVite.js'

type PageConfigCallbackContext = {
  /** The environment loading Vike's virtual file */
  environment: Environment
  /** Resolves an import as the environment's plugins do */
  resolve: (source: string, importer?: string) => Promise<{ id: string } | null>
}
type OnPageConfigs = (
  args: { pages: Record<string, { config: Config }> } & PageConfigCallbackContext,
) => void | Promise<void>

const globalObject = getGlobalObject('pluginVirtualFiles/runPageConfigCallbacks.ts', {
  callbacksRun: new WeakMap<VikeConfigInternal, Promise<void>>(),
})

// Call the `vike.onPageConfigs()` of each Vite plugin, once per Vike config and upon rerunOnPageConfigs(), before Vike serializes its page configs
async function runPageConfigCallbacks(vikeConfig: VikeConfigInternal, context: PageConfigCallbackContext) {
  let callbacksRun = globalObject.callbacksRun.get(vikeConfig)
  if (!callbacksRun) {
    const { plugins } = context.environment.getTopLevelConfig()
    // A page config is set as a + file sets it
    const pages = vikeConfig.pages as Record<string, { config: Config }>
    callbacksRun = (async () => {
      for (const plugin of plugins) await plugin.vike?.onPageConfigs?.({ pages, ...context })
    })()
    globalObject.callbacksRun.set(vikeConfig, callbacksRun)
    // The next Vike virtual file loaded calls the callbacks again
    callbacksRun.catch(() => clearPageConfigCallbacks(vikeConfig))
  }
  await callbacksRun
}

function clearPageConfigCallbacks(vikeConfig: VikeConfigInternal) {
  globalObject.callbacksRun.delete(vikeConfig)
}
