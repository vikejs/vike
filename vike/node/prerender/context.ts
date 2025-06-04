export { isPrerenderAutoRunEnabled }
export { temp_disablePrerenderAutoRun }
export { isPrerendering }
export { setContextIsPrerendering }

import type { VikeConfigInternal } from '../vite/shared/resolveVikeConfig.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { resolvePrerenderConfigGlobal } from './resolvePrerenderConfig.js'
const globalObject = getGlobalObject<{ isDisabled?: true; isPrerendering?: true }>('prerender/context.ts', {})

function isPrerenderAutoRunEnabled(vikeConfig: VikeConfigInternal) {
  const prerenderConfigGlobal = resolvePrerenderConfigGlobal(vikeConfig)
  return (
    prerenderConfigGlobal.isPrerenderingEnabled &&
    !(prerenderConfigGlobal || {}).disableAutoRun &&
    !globalObject.isDisabled &&
    vikeConfig.config.disableAutoFullBuild !== 'prerender'
  )
}

// TODO/v1-release: remove
function temp_disablePrerenderAutoRun() {
  globalObject.isDisabled = true
}

function isPrerendering(): boolean {
  return !!globalObject.isPrerendering
}
function setContextIsPrerendering(): void {
  globalObject.isPrerendering = true
}
