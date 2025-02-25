export { isPrerenderEnabled }
export { isPrerenderAutoRunEnabled }
export { temp_disablePrerenderAutoRun }
export { isPrerendering }
export { setContextIsPrerendering }

import type { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { resolvePrerenderConfigGlobal } from './resolvePrerenderConfigGlobal.js'
const globalObject = getGlobalObject<{ isDisabled?: true; isPrerendering?: true }>('prerender/context.ts', {})

function isPrerenderEnabled(vikeConfig: VikeConfigObject) {
  const prerenderConfig = resolvePrerenderConfigGlobal(vikeConfig)
  return !!prerenderConfig
}
function isPrerenderAutoRunEnabled(vikeConfig: VikeConfigObject) {
  const prerenderConfig = resolvePrerenderConfigGlobal(vikeConfig)
  return (
    isPrerenderEnabled(vikeConfig) &&
    !(prerenderConfig || {}).disableAutoRun &&
    !globalObject.isDisabled &&
    vikeConfig.global.config.disableAutoFullBuild !== 'prerender'
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
