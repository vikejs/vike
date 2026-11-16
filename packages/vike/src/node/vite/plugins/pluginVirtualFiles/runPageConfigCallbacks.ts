export { runPageConfigCallbacks }
export { rerunPageConfigCallbacks }
export { clearPageConfigCallbacks }
export type { OnCreatePageConfigs }

import type { Plugin } from 'vite'
import { getVikeConfigInternal, type VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import '../../assertEnvVite.js'

type OnCreatePageConfigs = () => void | Promise<void>

const globalObject = getGlobalObject('pluginVirtualFiles/runPageConfigCallbacks.ts', {
  callbacksRun: new WeakMap<VikeConfigInternal, Promise<void>>(),
})

// Call the `vike.onCreatePageConfigs()` of each Vite plugin, once per Vike config, before Vike generates its virtual files
async function runPageConfigCallbacks(plugins: readonly Plugin[]) {
  const vikeConfig = await getVikeConfigInternal(true)
  let callbacksRun = globalObject.callbacksRun.get(vikeConfig)
  if (!callbacksRun) {
    callbacksRun = (async () => {
      for (const plugin of plugins) await plugin.vike?.onCreatePageConfigs?.()
    })()
    globalObject.callbacksRun.set(vikeConfig, callbacksRun)
    // The next Vike virtual file loaded calls the callbacks again
    callbacksRun.catch(() => clearPageConfigCallbacks(vikeConfig))
  }
  await callbacksRun
}

// Development: Vike calls the `vike.onCreatePageConfigs()` of each Vite plugin again after a file change that doesn't reload Vike's config
async function rerunPageConfigCallbacks(plugins: readonly Plugin[]) {
  clearPageConfigCallbacks(await getVikeConfigInternal(true))
  await runPageConfigCallbacks(plugins)
}

function clearPageConfigCallbacks(vikeConfig: VikeConfigInternal) {
  globalObject.callbacksRun.delete(vikeConfig)
}
