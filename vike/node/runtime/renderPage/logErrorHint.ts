export { logErrorHint }

// For ./logErrorHint/*.spec.ts
export { isCjsEsmError }
export { isKnownError }
export { getHint }

import { assert, formatHintLog, isNotNullish, isObject, unique } from '../utils.js'

const knownErrors = [
  {
    errMsg: 'jsxDEV is not a function',
    link: 'https://github.com/vikejs/vike/issues/1469#issuecomment-1919518096'
  },
  {
    errMsg:
      'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components)',
    link: 'https://vike.dev/broken-npm-package#react-invalid-component'
  },
  {
    // ```
    // Error [RollupError]: Could not resolve "../dist/client/assets.json" from "renderer/+onRenderHtml.tsx"
    // ```
    errMsg: 'assets.json',
    link: 'https://vike.dev/getGlobalContext'
  }
]

function logErrorHint(error: unknown): void {
  /* Collect errors for ./logErrorHint.spec.ts
  collectError(error)
  //*/
  const hint = getHint(error)
  if (hint) logHint(hint)
}
function getHint(error: unknown): null | string {
  {
    const link = isKnownError(error)
    if (link) return `To fix this error, see ${link}`
  }

  const res = isCjsEsmError(error)
  if (res) {
    const hint = 'The error seems to be a CJS/ESM issue, see https://vike.dev/broken-npm-package'
    return hint
  }

  return null
}
function logHint(hint: string) {
  hint = formatHintLog(hint)
  console.error(hint)
}

function isKnownError(error: unknown): false | string {
  const anywhere = getAnywhere(error)
  const knownErr = knownErrors.find((knownErorr) => {
    return includes(anywhere, knownErorr.errMsg)
  })
  if (!knownErr) return false
  return knownErr.link
}

// `false` -> noop
// `true` -> generic message
// `'some-npm-package'` -> add some-npm-package to `ssr.noExternal`
function isCjsEsmError(error: unknown): boolean | string[] {
  const res = check(error)
  if (res === true || res === false) return res
  const packageNames = normalizeRes(res)
  if (packageNames === false) return packageNames
  packageNames.forEach((packageName) => {
    assert(!['vite', 'vike'].includes(packageName))
  })
  // We don't use this anymore: we could return `true` instead. Shall we remove returning a list of npm packages?
  return packageNames
}
function normalizeRes(res: string | string[]): string[] | false {
  let packageNames: string[] = Array.isArray(res) ? res : [res]
  packageNames = unique(packageNames.filter(isNotNullish).filter((packageName) => packageName !== '@brillout/import'))
  if (packageNames.length === 0) return false
  return packageNames
}
function check(error: unknown): boolean | string | string[] {
  const message = getErrMessage(error)
  const anywhere = getAnywhere(error)
  const packageName_stack1 = getPackageName_stack1(error)
  const packageName_stack2 = getPackageName_stack2(error)
  const isRelatedToNodeModules = !!packageName_stack1 || !!packageName_stack2 || includesNodeModules(message)
  /*
  const relatedNpmPackages = normalizeArray([
    packageName_stack1 || null,
    packageName_stack2 || null,
    (message && extractFromNodeModulesPath(message)) || null
  ])
  */

  // ERR_UNSUPPORTED_DIR_IMPORT
  {
    const packageName = parseNodeModulesPathMessage('ERR_UNSUPPORTED_DIR_IMPORT', anywhere)
    if (packageName) return packageName
  }

  // ERR_UNKNOWN_FILE_EXTENSION
  {
    const packageName = parseUnkownFileExtensionMessage(anywhere)
    if (packageName) return packageName
  }
  {
    const packageName = parseNodeModulesPathMessage('ERR_UNKNOWN_FILE_EXTENSION', anywhere)
    if (packageName) return packageName
  }

  {
    const packageName = parseNodeModulesPathMessage('is not exported', anywhere)
    if (packageName) return packageName
  }

  // Using CJS inside ESM modules.
  if (
    includes(anywhere, 'require is not a function') ||
    includes(anywhere, 'exports is not defined') ||
    includes(anywhere, 'module is not defined') ||
    includes(anywhere, 'window is not defined') ||
    includes(anywhere, 'not defined in ES')
  ) {
    if (packageName_stack1) return packageName_stack1
  }

  if (includes(anywhere, "Unexpected token 'export'")) {
    if (packageName_stack2) return packageName_stack2
    if (packageName_stack1) return packageName_stack1
  }

  // ERR_REQUIRE_ESM
  if (includes(anywhere, 'ERR_REQUIRE_ESM')) {
    /* The issue is the importer, not the importee.
    if (relatedNpmPackages) return relatedNpmPackages
     */
    {
      if (packageName_stack1) return packageName_stack1
    }
    if (isRelatedToNodeModules) return true
  }
  /* The following two wrongfully match user land errors
  {
    const packageNames = parseNodeModulesPath('ERR_REQUIRE_ESM', anywhere)
    if (packageNames) return packageNames
  }
  {
    const packageNames = parseNodeModulesPath('Must use import', anywhere)
    if (packageNames) return packageNames
  }
  */

  // `SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.`
  {
    const packageName = parseImportFrom(anywhere)
    if (packageName) return packageName
  }

  if (includes(anywhere, 'Cannot read properties of undefined')) {
    if (isRelatedToNodeModules) {
      /* We return true because relatedNpmPackages points to the importer but the problematic npm package is the importee
      if (relatedNpmPackages) return relatedNpmPackages
      */
      return true
    }
  }

  // ERR_MODULE_NOT_FOUND
  {
    const packageNames = parseCannotFindMessage(anywhere)
    if (packageNames) return packageNames
  }

  if (
    // `SyntaxError: Cannot use import statement outside a module`.
    // Since user code is always ESM, this error must always originate from an npm package.
    includes(anywhere, 'Cannot use import statement') ||
    // `SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.`
    // It seems that this always points to an npm package import.
    /Named export.*not found/i.test(anywhere)
  ) {
    /* We return true even if fromNodeModules is false because the errors always relate to npm packages.
    if (fromNodeModules) return true
    */
    return true
  }

  return false
}

function parseCannotFindMessage(str: string) {
  const match = /Cannot find \S+ '(\S+)' imported from (\S+)/.exec(str)
  if (!match) return false
  // const packageNameCannotFind = extractFromPath(match[1]!)
  const packageNameFrom = extractFromPath(match[2]!)
  return normalizeArray([
    // packageNameCannotFind,
    packageNameFrom
  ])
}
function parseUnkownFileExtensionMessage(str: string) {
  const match = /Unknown file extension "\S+" for (\S+)/.exec(str)
  if (!match) return false
  const filePath = match[1]!
  const packageName = extractFromPath(filePath)
  return packageName
}
function parseImportFrom(str: string) {
  const match = /\bimport\b.*?\bfrom\b\s*?"(.+?)"/.exec(str)
  if (!match) return false
  const importPath = match[1]!
  const packageName = extractFromPath(importPath)
  return packageName
}
function parseNodeModulesPathMessage(begin: string, str: string) {
  str = str.replaceAll('\\', '/')
  const regex = new RegExp(`${begin}.*(node_modules\\/\\S+)`)
  const match = regex.exec(str)
  if (!match) return false
  const importPath = match[1]!
  return extractFromNodeModulesPath(importPath)
}

function getPackageName_stack1(err: unknown) {
  const errStack = getErrStack(err)
  if (!errStack) return false
  const firstLineStackTrace = errStack.split('\n').filter((line) => line.startsWith('    at '))[0]
  if (!firstLineStackTrace) return false
  return extractFromNodeModulesPath(firstLineStackTrace)
}
/** See https://github.com/brillout/repro_node-syntax-error#nodejs-behavior */
function getPackageName_stack2(err: unknown) {
  const errStack = getErrStack(err)
  if (!errStack) return false
  const firstLine = errStack.trim().split('\n')[0]!
  return extractFromNodeModulesPath(firstLine)
}

function extractFromPath(filePath: string): string | null {
  assert(filePath)

  filePath = clean(filePath)
  filePath = filePath.replaceAll('\\', '/')

  let packageName: string
  if (!filePath.includes('node_modules/')) {
    packageName = filePath
    if (packageName.startsWith('/')) return null
    if (packageName.startsWith('.')) return null
  } else {
    packageName = filePath.split('node_modules/').pop()!
    // This assert is fairly risk, we should eventually remove it
    assert(!packageName.startsWith('.'))
    // This assert is fairly risk, we should eventually remove it
    assert(!packageName.startsWith('/'))
  }
  if (!packageName) return null

  packageName = packageName.split('/').slice(0, 2).join('/')
  if (!packageName.startsWith('@')) {
    packageName = packageName.split('/')[0]!
  }

  packageName = clean(packageName)

  return packageName
}
function clean(packageName: string) {
  const b = ['"', "'", '(', ')']
  if (b.includes(packageName[0]!)) {
    packageName = packageName.slice(1)
  }
  if (b.includes(packageName[packageName.length - 1]!)) {
    packageName = packageName.slice(0, -1)
  }
  return packageName
}
function extractFromNodeModulesPath(str: string) {
  if (!includesNodeModules(str)) return false
  const packageName = extractFromPath(str)
  assert(packageName)
  return packageName
}

function includes(str1: string | null, str2: string): boolean {
  return !!str1 && str1.toLowerCase().includes(str2.toLowerCase())
}
function includesNodeModules(str: string | null): boolean {
  if (!str) return false
  str = str.replaceAll('\\', '/')
  if (!str.includes('node_modules/')) return false
  if (str.includes('node_modules/vite/')) return false
  return true
}

function normalizeArray(arr: (string | null)[]): string[] | null {
  const arrNormalized = arr.filter(isNotNullish)
  if (arrNormalized.length === 0) return null
  return arrNormalized
}

function getErrMessage(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!err.message) return null
  if (typeof err.message !== 'string') return null
  return err.message
}
function getErrCode(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!err.code) return null
  if (typeof err.code !== 'string') return null
  return err.code
}
function getErrStack(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!err.stack) return null
  if (typeof err.stack !== 'string') return null
  return err.stack
}
function getAnywhere(error: unknown): string {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const anywhere = [code, message, stack].filter(Boolean).join('\n')
  return anywhere
}

function collectError(err: any) {
  console.log(
    [
      '{',
      `  message: ${JSON.stringify(err.message)},`,
      `  code: ${JSON.stringify(err.code)},`,
      '  stack: `\n' + err.stack + '\n`',
      '}'
    ].join('\n')
  )
  /* For reproductions using older vite-plugin-ssr versions, do one of the following.
      - If upon pre-rendering:https: //github.com/brillout/repro_node-syntax-error#error-catched-by-vite-plugin-ssr
      - Inject the logger inside `catch` in node_modules/vite-plugin-ssr/dist/esm/node/runtime/renderPage.js
      - Inject the following inside `configResolved(config_)` at node_modules/vite-plugin-ssr/dist/cjs/node/plugin/plugins/devConfig/index.js
        ```js
        config_.logger.error = (msg, options) => {
          const { error } = options;
          if (error) return;
          console.log(...);
        };
        ```
  */
}
