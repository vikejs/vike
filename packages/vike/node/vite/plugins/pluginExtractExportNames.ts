export { pluginExtractExportNames }
export { isUsingClientRouter }
export { extractExportNamesRE }

import type { Plugin, ResolvedConfig } from 'vite'
import {
  assert,
  getFileExtension,
  createDebugger,
  getGlobalObject,
  assertUsage,
  rollupSourceMapRemove,
} from '../utils.js'
import { getExportNames } from '../shared/parseEsModule.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
const extractExportNamesRE = /(\?|&)extractExportNames(?:&|$)/
const debug = createDebugger('vike:pluginExtractExportNames')
const globalObject = getGlobalObject<{ usesClientRouter?: true }>('plugins/pluginExtractExportNames.ts', {})

const filterRolldown = {
  id: {
    include: extractExportNamesRE,
  },
}
const filterFunction = (id: string) => extractExportNamesRE.test(id)

function pluginExtractExportNames(): Plugin {
  let isDev = false
  let config: ResolvedConfig
  return {
    name: 'vike:pluginExtractExportNames',
    enforce: 'post',
    transform: {
      filter: filterRolldown,
      async handler(src, id, options) {
        id = normalizeId(id)
        const isClientSide = !isViteServerSide_extraSafe(config, this.environment, options)
        assert(filterFunction(id))
        const code = await getExtractExportNamesCode(src, isClientSide, !isDev, id)
        debug('id ' + id, ['result:\n' + code.code.trim(), 'src:\n' + src.trim()])
        return code
      },
    },
    configureServer: {
      handler() {
        isDev = true
      },
    },
    configResolved: {
      handler(config_) {
        config = config_
      },
    },
    config: {
      handler() {
        if (debug.isActivated) {
          return { logLevel: 'silent' }
        }
      },
    },
  }
}

async function getExtractExportNamesCode(src: string, isClientSide: boolean, isProduction: boolean, id: string) {
  const { exportNames, wildcardReExports } = await getExportNames(src)
  if (isClientSide && exportNames.includes('clientRouting')) {
    globalObject.usesClientRouter = true
  }
  const code = getCode(exportNames, wildcardReExports, isClientSide, isProduction, id)
  return rollupSourceMapRemove(code)
}

function getCode(
  exportNames: string[],
  wildcardReExports: string[],
  isClientSide: boolean,
  isProduction: boolean,
  id: string,
) {
  let code = ''
  const reExportVarNames = wildcardReExports.map((reExportedModuleName, i) => {
    const varName = `m${i}`
    code += `import { exportNames as ${varName} } from '${addQuery(reExportedModuleName, id)}'`
    code += '\n'
    return varName
  })

  code += '\n'
  code += `export const exportNames = [${[
    ...exportNames.map((n) => JSON.stringify(n)),
    ...reExportVarNames.map((varName) => `...${varName}`),
  ].join(', ')}];`

  code = injectHmr(code, isClientSide, isProduction)

  return code
}

function addQuery(moduleName: string, id: string) {
  if (moduleName.includes('?')) {
    assert(moduleName.split('?').length === 2)
    moduleName = moduleName.replace('?', '?extractExportNames&')
  } else {
    const fileExtension = getFileExtension(moduleName)
    if (!fileExtension) {
      assert(extractExportNamesRE.test(id))
      const idReal = id.split('?')[0]!
      assertUsage(
        false,
        `Modify the re-export of ${idReal}, see https://github.com/vikejs/vike/issues/864#issuecomment-1537202290`,
      )
    }
    moduleName = `${moduleName}?extractExportNames&lang.${fileExtension}`
  }
  return moduleName
}

function injectHmr(code: string, isClientSide: boolean, isProduction: boolean) {
  if (isProduction) {
    return code
  }

  if (isClientSide) {
    code += '\n'
    code += `if (import.meta.hot) import.meta.hot.accept((mod) => { exportNames.length=0; exportNames.push(...mod.exportNames); });`
  } else {
    // Ensure Vite considers the module as `isSelfAccepting`. (Needed because Vite's module graph erroneously conflates the Vite server-side modules with their client-side counterparts.)
    code += '\n'
    code += 'if(false){import.meta.hot.accept(()=>{})};'
  }

  return code
}

function isUsingClientRouter(): boolean {
  return globalObject.usesClientRouter === true
}
