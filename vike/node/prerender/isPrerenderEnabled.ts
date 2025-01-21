export { isPrerenderEnabled }

import type { VikeConfigGlobal } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'

function isPrerenderEnabled(vikeConfigGlobal: VikeConfigGlobal) {
  return (
    vikeConfigGlobal.prerender &&
    !vikeConfigGlobal.prerender.disableAutoRun &&
    vikeConfigGlobal.disableAutoFullBuild !== 'prerender'
  )
}
