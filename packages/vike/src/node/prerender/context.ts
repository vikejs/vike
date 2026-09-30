export { isPrerenderAutoRunEnabled }
export { temp_disablePrerenderAutoRun }
export { wasPrerenderRun }
export { setWasPrerenderRun }
export { addClientBuildFiles }
export { getClientBuildFiles }

import type { VikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { resolvePrerenderConfigGlobal } from './resolvePrerenderConfig.js'
import type { PrerenderTrigger } from './runPrerender.js'
const globalObject = getGlobalObject<{
  isDisabled?: true
  wasPrerenderRun?: PrerenderTrigger
  clientBuildFiles?: Set<string>
}>('prerender/context.ts', {})

async function isPrerenderAutoRunEnabled(vikeConfig: VikeConfigInternal) {
  const prerenderConfigGlobal = await resolvePrerenderConfigGlobal(vikeConfig)
  return (
    prerenderConfigGlobal.isPrerenderingEnabled &&
    !(prerenderConfigGlobal || {}).disableAutoRun &&
    !globalObject.isDisabled &&
    vikeConfig.config.disableAutoFullBuild !== 'prerender'
  )
}

// TO-DO/next-major-release: remove
function temp_disablePrerenderAutoRun() {
  globalObject.isDisabled = true
}

function wasPrerenderRun(): false | PrerenderTrigger {
  return globalObject.wasPrerenderRun || false
}
function setWasPrerenderRun(trigger: PrerenderTrigger): void {
  globalObject.wasPrerenderRun = trigger
}

// The files written by the client build, including files emitted by plugins that aren't in the manifest (e.g. `emitFile({ type: 'asset', fileName: 'sitemap.xml' })`).
// Only available if pre-rendering runs in the process of the build (i.e. not with a standalone `$ vike prerender`).
function addClientBuildFiles(fileNames: string[]): void {
  globalObject.clientBuildFiles ??= new Set()
  fileNames.forEach((fileName) => globalObject.clientBuildFiles!.add(fileName))
}
function getClientBuildFiles(): null | Set<string> {
  return globalObject.clientBuildFiles ?? null
}
