export { getPlusMiddlewares }

import type { VikeConfigInternal } from './resolveVikeConfigInternal.js'

function getPlusMiddlewares(vikeConfig: VikeConfigInternal) {
  return (vikeConfig._pageConfigGlobal.configValueSources.middleware ?? [])
    .map((m) => {
      if ('filePathAbsoluteFilesystem' in m.definedAt) {
        return m.definedAt.filePathAbsoluteFilesystem
      }
      return null
    })
    .filter(Boolean) as string[]
}
