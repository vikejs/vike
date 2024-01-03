export { logHintForCjsEsmError }

// For ./logHintForCjsEsmError.spec.ts
export { precise }
export { fuzzy }
export { fuzzy2 }
export { isCjsEsmError }
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
    const result = fuzzy2(error)
    if (result) return result
  }

  {
    const errString = getErrorAsString(error)
    const result = fuzzy(errString)
    if (typeof result === 'string') return [result]
    return result
  }
}

function fuzzy2(error: unknown): boolean | string[] {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const anywhere = [code, message, stack].join('\n')
  const stackFirstLine = getErrStackFirstLine(error)
  const fromNodeModules = stackFirstLine?.includes('node_modules') || message?.includes('node_modules') || false

  // ERR_UNKNOWN_FILE_EXTENSION
  if (
    /*
    fromNodeModules
    /*/
    true
    //*/
  ) {
    const packageNames = parseUnkownFileExtension(anywhere)
    if (packageNames) return packageNames
  }

  // ERR_MODULE_NOT_FOUND
  if (fromNodeModules) {
    const packageNames = parseCannotFind(anywhere)
    if (packageNames) return packageNames
  }

  // CJS named export
  if (fromNodeModules) {
    const packageNames = parseImportFrom(anywhere)
    if (packageNames) return packageNames
  }

  if (fromNodeModules) {
    if (anywhere.includes('Cannot read properties of undefined')) {
      return true
    }
  }

  if (anywhere.includes('require is not a function')) {
    if (stackFirstLine?.includes('node_modules')) {
      const packageName = extractFromStackTraceLine(stackFirstLine)
      return clean([packageName])
    }
  }

  return false
}

function parseCannotFind(str: string): false | string[] {
  const match = /Cannot find \S+ '(\S+)' imported from (\S+)/.exec(str)
  if (!match) return false
  // const packageNameCannotFind = extractFromPath(match[1]!)
  const packageNameFrom = extractFromPath(match[2]!)
  return clean([
    // packageNameCannotFind,
    packageNameFrom
  ])
}
function parseUnkownFileExtension(str: string): false | string[] {
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

function precise(error: unknown): boolean | string[] {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const stackFirstLine = getErrStackFirstLine(error)

  if (code === 'ERR_MODULE_NOT_FOUND' && message) {
    const packageNames = parseCannotFind(message)
    if (packageNames) return packageNames
  }

  if (code === 'ERR_UNKNOWN_FILE_EXTENSION' && message) {
    const packageNames = parseUnkownFileExtension(message)
    if (packageNames) return packageNames
  }

  if (code === 'ERR_REQUIRE_ESM') {
    if (stackFirstLine?.includes('node_modules')) {
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

      const packageName = extractFromStackTraceLine(stackFirstLine)
      const packageNames = clean([packageName])
      return packageNames
    }
  }

  if (message?.startsWith('Cannot read properties of undefined')) {
    if (stackFirstLine?.includes('node_modules')) {
      return true
    }
  }

  if (message?.includes('require is not a function')) {
    if (stackFirstLine?.includes('node_modules')) {
      const packageName = extractFromStackTraceLine(stackFirstLine)
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

function fuzzy(errString: string | undefined) {
  if (!errString) return false

  const shouldParsePackageName = [
    `SyntaxError: Cannot use import statement outside a module`,
    `SyntaxError: Named export`,
    `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
    `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
    `ReferenceError: exports is not defined.*node_modules`
  ]
  const shouldShowHint = [
    `Error: Element type is invalid.*but got: undefined`,
    `TypeError: require is not a function`,
    `ERR_REQUIRE_ESM`,
    ...shouldParsePackageName
  ]

  const shouldShowHintRegex = new RegExp(shouldShowHint.join('|'), 's')
  if (!shouldShowHintRegex.test(errString)) return false

  const shouldParsePackageNameRegex = new RegExp(shouldParsePackageName.join('|'), 's')
  if (!shouldParsePackageNameRegex.test(errString)) return true

  const packageName = extractPackageName(errString)
  // TODO: this assertion may fail
  assert(packageName)
  return packageName
}

function getErrorAsString(error: unknown) {
  if (!error) {
    return
  }
  let parsed = ''

  if (typeof error === 'string') {
    parsed = error
  } else if (typeof error === 'object') {
    if ('name' in error && typeof error.name === 'string') {
      parsed = `${parsed}\n${error.name}`
    }

    if ('message' in error && typeof error.message === 'string') {
      parsed = `${parsed}\n${error.message}`
    }

    if ('stack' in error && typeof error.stack === 'string') {
      parsed = `${parsed}\n${error.stack}`
    }
  }

  return parsed
}

function extractPackageName(errString: string): string | null {
  let packageName: string | null = null

  // Extract package name from code snippet in error message
  {
    const match = /import.*?from ?"(.*?)"/.exec(errString)
    if (match?.length && typeof match[1] === 'string') {
      packageName = extractFromPath(match[1])
      return packageName
    }
  }

  // Extract package name from stack trace
  {
    const firstNodeModulesLine = errString.split('\n').find((line) => line.includes('node_modules/'))
    if (firstNodeModulesLine) {
      packageName = extractFromStackTraceLine(firstNodeModulesLine)
      return packageName
    }
  }

  return null
}

function extractFromPath(filePath: string): string | null {
  assert(filePath)

  filePath = removeQuotes(filePath)

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
function extractFromStackTraceLine(stackTraceLine: string): string {
  assert(stackTraceLine.includes('node_modules/'))
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

function isReactInvalidComponentError(err: unknown): boolean {
  const message = getErrMessage(err)
  if (!message) return false
  return message.includes(
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
