export { extractExportNamesPlugin }
export { isUsingClientRouter }
export { extractExportNamesRE }

import type { Plugin } from 'vite'
import { assert, getFileExtension, viteIsSSR_options, createDebugger, isDebugEnabled } from '../utils'
import { removeSourceMap, getExportNames } from '../helpers'
import { getGlobalObject } from '../../runtime/utils'
const extractExportNamesRE = /(\?|&)extractExportNames(?:&|$)/
const debugNamespace = 'vps:extractExportNames'
const debug = createDebugger(debugNamespace)
const debugEnabled = isDebugEnabled(debugNamespace)
const globalObject = getGlobalObject<{ usesClientRouter?: true }>('extractExportNamesPlugin.ts', {})

function extractExportNamesPlugin(): Plugin {
  let isDev = false
  return {
    name: 'vite-plugin-ssr:extractExportNames',
    enforce: 'post',
    async transform(src, id, options) {
      const isClientSide = !viteIsSSR_options(options)
      if (extractExportNamesRE.test(id)) {
        const code = await getExtractExportNamesCode(src, isClientSide, !isDev)
        debug('id ' + id, ['result:\n' + code.code.trim(), 'src:\n' + src.trim()])
        return code
      }
    },
    configureServer() {
      isDev = true
    },
    config() {
      if (debugEnabled) {
        return { logLevel: 'silent' }
      }
    }
  }
}

async function getExtractExportNamesCode(src: string, isClientSide: boolean, isProduction: boolean) {
  const { exportNames, wildcardReExports } = await getExportNames(src)
  if (isClientSide && exportNames.includes('clientRouting')) {
    globalObject.usesClientRouter = true
  }
  const code = getCode(exportNames, wildcardReExports, isClientSide, isProduction)
  return removeSourceMap(code)
}

function getCode(exportNames: string[], wildcardReExports: string[], isClientSide: boolean, isProduction: boolean) {
  let code = ''
  const reExportVarNames = wildcardReExports.map((reExportedModuleName, i) => {
    const varName = `m${i}`
    code += `import { exportNames as ${varName} } from '${addQuery(reExportedModuleName)}'`
    code += '\n'
    return varName
  })

  code += '\n'
  code += `export const exportNames = [${[
    ...exportNames.map((n) => JSON.stringify(n)),
    ...reExportVarNames.map((varName) => `...${varName}`)
  ].join(', ')}];`

  code = injectHmr(code, isClientSide, isProduction)

  return code
}

function addQuery(moduleName: string) {
  if (moduleName.includes('?')) {
    assert(moduleName.split('?').length === 2)
    moduleName = moduleName.replace('?', '?extractExportNames&')
  } else {
    const fileExtension = getFileExtension(moduleName)
    assert(fileExtension)
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
