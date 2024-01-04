export { logHintForCjsEsmError }

// For ./logHintForCjsEsmError/*.spec.ts
export { precise }
export { fuzzy }
export { isMatch }
export { getHintForCjsEsmError }
export { isReactInvalidComponentError }

import pc from '@brillout/picocolors'
import { assert, formatHintLog, isNotNullish, isObject, unique, joinEnglish } from '../utils.js'

function logHintForCjsEsmError(error: unknown): void {
  const hint = getHintForCjsEsmError(error)
  if (hint) logHint(hint)
}

function getHintForCjsEsmError(error: unknown): null | string {
  if (isReactInvalidComponentError(error)) {
    const hint = 'To fix this error, see https://vike.dev/broken-npm-package#react-invalid-component'
    return hint
  }

  const res = isCjsEsmError(error)
  if (res) {
    const packageNames = res === true ? null : res
    const hint = [
      'Error could be a CJS/ESM issue, consider ',
      !packageNames || packageNames.length === 0
        ? 'using'
        : `adding ${joinEnglish(
            packageNames!.map((p) => pc.cyan(`'${p}'`)),
            'or'
          )} to`,
      ` ${pc.cyan('ssr.noExternal')}`,
      ', see https://vike.dev/broken-npm-package'
    ].join('')
    return hint
  }

  return null
}

function logHint(hint: string) {
  hint = formatHintLog(hint)
  console.error(hint)
}

function isMatch(error: unknown): boolean | string[] {
  if (isReactInvalidComponentError(error)) {
    return true
  } else {
    return isCjsEsmError(error)
  }
}

/**
 * `false` -> noop
 * `true` -> generic message
 * `'some-npm-package'` -> add some-npm-package to `ssr.noExternal`
 */
function isCjsEsmError(error: unknown): boolean | string[] {
  /* Collect errors for ./logHintForCjsEsmError.spec.ts
  collectError(error)
  //*/

  {
    const result = precise(error)
    if (result) return result
  }

  {
    const result = fuzzy(error)
    if (result) return result
  }

  /* TODO: remove?
  {
    const errString = getErrorAsString(error)
    const result = fuzzy(errString)
    if (typeof result === 'string') return [result]
    return result
  }
  */

  return false
}

function fuzzy(error: unknown): boolean | string[] {
  const message = getErrMessage(error)
  const anywhere = getAnywhere(error)
  const stackFirstLine = getErrStackFirstLine(error)
  const fromNodeModules = includesNodeModules(stackFirstLine) || includesNodeModules(message)
  const relatedNpmPackages = clean([extractNpmPackageOptional(message), extractNpmPackageOptional(stackFirstLine)])

  // ERR_UNSUPPORTED_DIR_IMPORT
  {
    const packageNames = parseNodeModulesPathMessage('ERR_UNSUPPORTED_DIR_IMPORT', anywhere)
    if (packageNames) return packageNames
  }

  // ERR_UNKNOWN_FILE_EXTENSION
  {
    const packageNames = parseUnkownFileExtensionMessage(anywhere)
    if (packageNames) return packageNames
  }
  {
    const packageNames = parseNodeModulesPathMessage('ERR_UNKNOWN_FILE_EXTENSION', anywhere)
    if (packageNames) return packageNames
  }

  // Using CJS inside ESM modules
  {
    const exportsIsNotDefined = 'exports is not defined'
    {
      const packageNames = parseNodeModulesPathMessage(exportsIsNotDefined, anywhere)
      if (packageNames) return packageNames
    }
    if (includes(anywhere, 'require is not a function') || includes(anywhere, exportsIsNotDefined)) {
      if (includesNodeModules(stackFirstLine)) {
        const packageName = extractNpmPackage(stackFirstLine)
        return packageName
      }
    }
  }

  // ERR_REQUIRE_ESM
  if (includes(anywhere, 'ERR_REQUIRE_ESM')) {
    /* The issue is the importer, not the importee.
    if (relatedNpmPackages) return relatedNpmPackages
    */
    {
      const packageName = clean([extractNpmPackageOptional(stackFirstLine)])
      if (packageName) return packageName
    }
    if (fromNodeModules) return true
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

  // SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.
  {
    const packageNames = parseImportFrom(anywhere)
    if (packageNames) return packageNames
  }

  if (includes(anywhere, 'Cannot read properties of undefined')) {
    if (fromNodeModules) {
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
    // SyntaxError: Cannot use import statement outside a module
    // Since user code is always ESM, this error must always originate from an npm package
    includes(anywhere, 'Cannot use import statement') ||
    // SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.
    // It seems that this always points to an npm package import
    /Named export.*not found/i.test(anywhere)
  ) {
    /* We return true even if fromNodeModules is false because these errors always relate to npm packages
    if (fromNodeModules) return true
    */
    return true
  }

  return false
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
function extractNpmPackage(str: string | null): [string] {
  assert(str)
  assert(includesNodeModules(str))
  return [extractFromNodeModulesPath(str)]
}
function extractNpmPackageOptional(str: string | null): null | string {
  if (!str || !includesNodeModules(str)) return null
  return extractFromNodeModulesPath(str)
}

function parseCannotFindMessage(str: string): false | string[] {
  const match = /Cannot find \S+ '(\S+)' imported from (\S+)/.exec(str)
  if (!match) return false
  // const packageNameCannotFind = extractFromPath(match[1]!)
  const packageNameFrom = extractFromPath(match[2]!)
  return clean([
    // packageNameCannotFind,
    packageNameFrom
  ])
}
function parseUnkownFileExtensionMessage(str: string): false | string[] {
  const match = /Unknown file extension "\S+" for (\S+)/.exec(str)
  if (!match) return false
  const filePath = match[1]!
  const packageName = extractFromPath(filePath)
  return clean([packageName])
}
function parseImportFrom(str: string): false | string[] {
  const match = /\bimport\b.*?\bfrom\b\s*?"(\S+?)"/.exec(str)
  if (!match) return false
  const importPath = match[1]!
  const packageName = extractFromPath(importPath)
  return clean([packageName])
}
function parseNodeModulesPathMessage(sentenceBegin: string, str: string) {
  str = str.replaceAll('\\', '/')
  const match = new RegExp(`${sentenceBegin}.*(node_modules\\S+)`).exec(str)
  if (!match) return false
  const importPath = match[1]!
  const packageName = extractFromNodeModulesPath(importPath)
  return clean([packageName])
}

function precise(error: unknown): boolean | string[] {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const stackFirstLine = getErrStackFirstLine(error)

  if (code === 'ERR_MODULE_NOT_FOUND' && message) {
    const packageNames = parseCannotFindMessage(message)
    if (packageNames) return packageNames
  }

  if (code === 'ERR_UNKNOWN_FILE_EXTENSION' && message) {
    const packageNames = parseUnkownFileExtensionMessage(message)
    if (packageNames) return packageNames
  }

  if (code === 'ERR_REQUIRE_ESM') {
    if (includesNodeModules(stackFirstLine)) {
      /* Not reliable as stack traces have different formats:
       * ```
       * at file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:10:1
       * ```
       * Or:
       * ```
       * at onRenderHtml (file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:21:49)
       * ```
      const match = /at \S+ (\S+)/.exec(stackFirstLine)
      */

      const packageName = extractNpmPackage(stackFirstLine!)
      return packageName
    }
  }

  if (message?.startsWith('Cannot read properties of undefined')) {
    if (stackFirstLine?.includes('node_modules')) {
      return true
    }
  }

  if (message?.includes('require is not a function')) {
    if (stackFirstLine?.includes('node_modules')) {
      const packageName = extractFromNodeModulesPath(stackFirstLine)
      return clean([packageName])
    }
  }

  if (stack) {
    const packageNames = parseImportFrom(stack)
    if (packageNames) return packageNames
  }

  return false
}
function clean(packageNames: (string | null)[]): string[] | false {
  const result = unique(packageNames.filter(isNotNullish))
  if (result.length === 0) return false
  return result
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
function getErrStackFirstLine(err: unknown): null | string {
  const errStack = getErrStack(err)
  if (!errStack) return null
  const match = errStack.split('\n').filter((line) => line.startsWith('    at '))[0]
  return match ?? null
}
function getAnywhere(error: unknown): string {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const anywhere = [code, message, stack].filter(Boolean).join('\n')
  return anywhere
}

function extractFromPath(filePath: string): string | null {
  assert(filePath)

  filePath = removeQuotes(filePath)
  filePath = filePath.replaceAll('\\', '/')

  let packageName: string
  if (!filePath.includes('node_modules/')) {
    packageName = filePath
    if (packageName.startsWith('/')) return null
    if (packageName.startsWith('.')) return null
  } else {
    packageName = filePath.split('node_modules/').pop()!
    assert(!packageName.startsWith('.'))
    assert(!packageName.startsWith('/'))
  }
  if (!packageName) return null

  packageName = packageName.split('/').slice(0, 2).join('/')
  if (!packageName.startsWith('@')) {
    packageName = packageName.split('/')[0]!
  }

  assert(!packageName.startsWith('/'))
  assert(!packageName.startsWith('.'))
  assert(!packageName.endsWith(')'))
  assert(!['vite', 'vike'].includes(packageName))
  return packageName
}
function extractFromNodeModulesPath(stackTraceLine: string): string {
  assert(includesNodeModules(stackTraceLine))
  const packageName = extractFromPath(stackTraceLine)
  assert(packageName)
  return packageName
}

function removeQuotes(packageName: string) {
  if (packageName) {
    if (packageName.startsWith('"') || packageName.startsWith("'")) {
      packageName = packageName.slice(1)
    }
    if (packageName.endsWith('"') || packageName.endsWith("'")) {
      packageName = packageName.slice(0, -1)
    }
  }
  return packageName
}

function isReactInvalidComponentError(error: unknown): boolean {
  const anywhere = getAnywhere(error)
  return includes(
    anywhere,
    'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components)'
  )
}

function collectError(error: any) {
  console.log(
    [
      '{',
      `  message: ${JSON.stringify(error.message)},`,
      `  code: ${JSON.stringify(error.code)},`,
      '  stack: `\n' + error.stack + '\n`',
      '}'
    ].join('\n')
  )
  /* For reproductions using older vite-plugin-ssr versions, do one of the following.
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
