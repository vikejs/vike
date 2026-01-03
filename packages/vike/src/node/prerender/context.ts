export { isPrerenderAutoRunEnabled }
export { temp_disablePrerenderAutoRun }
export { wasPrerenderRun }
export { setWasPrerenderRun }

import type { VikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { resolvePrerenderConfigGlobal } from './resolvePrerenderConfig.js'
import type { PrerenderTrigger } from './runPrerender.js'
const globalObject = getGlobalObject<{ isDisabled?: true; wasPrerenderRun?: PrerenderTrigger }>(
  'prerender/context.ts',
  {},
)

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
