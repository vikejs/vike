export { pluginReplaceConstantsNonRunnableDev }

// We cannot use [`define`](https://vite.dev/config/shared-options.html#define) because we don't have access to `this.environment` and therefore we cannot call `isRunnableDevEnvironment(this.environment)` inside a configEnvironment() hook.

import { isRunnableDevEnvironment, isDevCheck, assert } from '../../utils.js'
import { getMagicString } from '../../shared/getMagicString.js'
import type { Plugin } from 'vite'

declare global {
  var __VIKE__IS_NON_RUNNABLE_DEV: undefined | true
  var __VIKE__DYNAMIC_IMPORT: (module: `virtual:${string}`) => Promise<Record<string, unknown>>
}

const IS_NON_RUNNABLE_DEV = 'globalThis.__VIKE__IS_NON_RUNNABLE_DEV'
const DYNAMIC_IMPORT = '__VIKE__DYNAMIC_IMPORT'

// === Rolldown filter
const filterRolldown1 = {
  code: {
    include: IS_NON_RUNNABLE_DEV,
  },
}
const filterFunction1 = (code: string) => {
  return code.includes(IS_NON_RUNNABLE_DEV)
}
const filterRolldown2 = {
  code: {
    include: DYNAMIC_IMPORT,
  },
}
const filterFunction2 = (code: string) => {
  return code.includes(DYNAMIC_IMPORT)
}
// We cannot use [`filter.id`](https://rolldown.rs/plugins/hook-filters) because Vite's optimizeDeps bundles packages (e.g. `vike` or `telefunc`) into node_modules/.vite/deps_ssr/chunk-WBC5FHD7.js
//
// Therefore, we cannot do this:
// ```js
// const distFileIsNonRunnableDev = requireResolveDistFile('dist/utils/isNonRunnableDevProcess.js')
// const distFileGlobalContext = requireResolveDistFile('dist/server/runtime/globalContext.js')
// const filterRolldown = {
//   id: {
//     include: [distFileIsNonRunnableDev, distFileGlobalContext].map(
//       (filePath) => new RegExp(`^${escapeRegex(filePath)}($|${escapeRegex('?')}.*)`),
//     ),
//   },
// }
// ```
// ===

function pluginReplaceConstantsNonRunnableDev(): Plugin[] {
  return [
    {
      name: 'vike:pluginReplaceConstantsNonRunnableDev:IS_NON_RUNNABLE_DEV',
      apply: (_, configEnv) => isDevCheck(configEnv),
      transform: {
        filter: filterRolldown1,
        handler(code, id) {
          assert(filterFunction1(code))
          if (isRunnableDevEnvironment(this.environment)) return
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          magicString.replaceAll(IS_NON_RUNNABLE_DEV, JSON.stringify(true))
          return getMagicStringResult()
        },
      },
    },
    {
      name: 'vike:pluginReplaceConstantsNonRunnableDev:DYNAMIC_IMPORT',
      apply: (_, configEnv) => isDevCheck(configEnv),
      transform: {
        filter: filterRolldown2,
        handler(code, id) {
          assert(filterFunction2(code))
          if (isRunnableDevEnvironment(this.environment)) return
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          magicString.replaceAll(DYNAMIC_IMPORT, 'import')
          return getMagicStringResult()
        },
      },
    },
  ]
}
