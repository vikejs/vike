export { isPrerenderAutoRunEnabled }

import type { VikeConfigGlobal } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'

function isPrerenderAutoRunEnabled(vikeConfigGlobal: VikeConfigGlobal) {
  return (
    vikeConfigGlobal.prerender &&
    !vikeConfigGlobal.prerender.disableAutoRun &&
    vikeConfigGlobal.disableAutoFullBuild !== 'prerender'
  )
}
