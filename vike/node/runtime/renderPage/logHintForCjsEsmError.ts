export { logHintForCjsEsmError }
// For ./logHintForCjsEsmError.spec.ts
export { isCjsEsmError }
export { isReactUndefinedComponentError }

import pc from '@brillout/picocolors'
import { assert, formatHintLog, isNotNullish, isObject, unique, joinEnglish } from '../utils.js'

function logHintForCjsEsmError(error: unknown): void {
  if (isReactUndefinedComponentError(error)) {
    const hint = 'To fix this error, see https://vike.dev/broken-npm-package#react-undefined-component'
    logHint(hint)
    return
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
    logHint(hint)
    return
  }
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
  console.log(
    [
      '{',
      `  message: ${JSON.stringify((error as Error).message)},`,
      `  code: ${JSON.stringify((error as any).code)},`,
      '  stack: `\n' + (error as Error).stack + '\n`',
      '}'
    ].join('\n')
  )
  //*/

  {
    const packageNames = precise(error)
    if (packageNames.length) return packageNames
  }

  {
    const result = fuzzy(error)
    if (typeof result === 'string') return [result]
    return result
  }
}

function precise(error: unknown): string[] {
  const code = getErrCode(error)
  let packageNames: (string | null)[] = []

  if (code === 'ERR_MODULE_NOT_FOUND') {
    const errMsg = getErrMessage(error)
    assert(errMsg)
    const match = /Cannot find \S+ '(\S+)' imported from (\S+)/.exec(errMsg)
    if (match) {
      const filePathCannotFind = extractFromPath(match[1]!)
      const filePathFrom = extractFromPath(match[2]!)
      packageNames = [filePathCannotFind, filePathFrom]
    }
  }

  if (code === 'ERR_UNKNOWN_FILE_EXTENSION') {
    const errMsg = getErrMessage(error)
    assert(errMsg)
    const match = /Unknown file extension "\S+" for (\S+)/.exec(errMsg)
    if (match) {
      const filePath = extractFromPath(match[1]!)
      packageNames = [filePath]
    }
  }

  return unique(packageNames.filter(isNotNullish))
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

function fuzzy(error: unknown) {
  const errString = getErrorAsString(error)
  if (!errString) return false

  const shouldParsePackageName = [
    `SyntaxError: Cannot use import statement outside a module`,
    `SyntaxError: Named export`,
    `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
    `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
    `ReferenceError: exports is not defined.*node_modules`
  ]
  /*
  const shouldShowHintOnlyIfPackageName = [
      // `Cannot find module`,
  ]
  */
  const shouldShowHint = [
    `Error: Element type is invalid.*but got: undefined`,
    `TypeError: require is not a function`,
    // `TypeError: Cannot read properties of undefined`,
    `ERR_REQUIRE_ESM`,
    ...shouldParsePackageName
  ]

  const shouldShowHintRegex = new RegExp(shouldShowHint.join('|'), 's')
  if (!shouldShowHintRegex.test(errString)) return false

  const shouldParsePackageNameRegex = new RegExp(shouldParsePackageName.join('|'), 's')
  if (!shouldParsePackageNameRegex.test(errString)) return true

  const packageName = extractPackageName(errString, error)
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

function extractPackageName(errString: string, error: unknown): string | null {
  let packageName: string | null = null

  // Extract package name from code snippet in error message
  {
    const match = /import.*?from ?"(.*?)"/.exec(errString)
    if (match?.length && typeof match[1] === 'string') {
      packageName = extractFromPath(match[1], true)
      return packageName
    }
  }

  // Extract package name from stack trace
  {
    const firstNodeModulesLine = errString.split('\n').find((line) => line.includes('node_modules/'))
    if (firstNodeModulesLine) {
      packageName = extractFromPath(firstNodeModulesLine)
      return packageName
    }
  }

  return null
}
function extractFromPath(filePath: string, doNotExpectNodeModules?: true): string | null {
  assert(filePath)

  if (!doNotExpectNodeModules && !filePath.includes('node_modules/')) return null
  let packageName = filePath.split('node_modules/').pop()!.split('/').slice(0, 2).join('/')
  if (!packageName) return null
  assert(!packageName.startsWith('/'), packageName)
  if (!packageName.startsWith('@')) {
    packageName = packageName.split('/')[0]!
  }
  if (packageName.startsWith('.')) return null
  assert(!packageName.startsWith('/'))

  packageName = removeQuotes(packageName)

  // TODO
  assert(!['vite'].includes(packageName))

  return packageName
}
function removeQuotes(packageName: string) {
  if (packageName) {
    if (packageName.startsWith('"')) {
      packageName = packageName.slice(1)
    }
    if (packageName.endsWith('"')) {
      packageName = packageName.slice(0, -1)
    }
  }
  return packageName
}

function isReactUndefinedComponentError(err: unknown): boolean {
  const errMsg = getErrMessage(err)
  if (!errMsg) return false
  return errMsg.includes(
    'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components)'
  )
}
