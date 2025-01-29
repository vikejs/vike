export { isPrerenderAutoRunEnabled }
export { temp_disablePrerenderAutoRun }

import type { VikeConfigGlobal } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
const globalObject = getGlobalObject<{ isDisabled?: true }>('prerender/context.ts', {})

function isPrerenderAutoRunEnabled(vikeConfigGlobal: VikeConfigGlobal) {
  return (
    vikeConfigGlobal.prerender &&
    !vikeConfigGlobal.prerender.disableAutoRun &&
    !globalObject.isDisabled &&
    vikeConfigGlobal.disableAutoFullBuild !== 'prerender'
  )
}

// TODO/v1-release: remove
function temp_disablePrerenderAutoRun() {
  globalObject.isDisabled = true
}
