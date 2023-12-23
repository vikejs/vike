export { logHintForCjsEsmError }

import pc from '@brillout/picocolors'

function logHintForCjsEsmError(error: unknown) {
  const errString = parseError(error)
  if (!errString) {
    return
  }

  const shouldShowMessage = new RegExp(
    [
      `Error: Element type is invalid`,
      `TypeError: require is not a function`,
      // `TypeError: Cannot read properties of undefined`,
      `SyntaxError: Named export`,
      `SyntaxError: Cannot use import statement outside a module`,
      `ReferenceError: exports is not defined.*node_modules`,
      `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
      `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
      `ERR_REQUIRE_ESM`
    ].join('|'),
    's'
  )
  const shouldParsePackageName = new RegExp(
    [
      `SyntaxError: Cannot use import statement outside a module`,
      `SyntaxError: Named export`,
      `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
      `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
      `ReferenceError: exports is not defined.*node_modules`
    ].join('|'),
    's'
  )

  if (shouldShowMessage.test(errString)) {
    let packageName = ''

    if (shouldParsePackageName.test(errString)) {
      packageName = parsePackageName(errString)
    }

    if (packageName) {
      console.log(
        `Please include ${pc.green(packageName)} in ${pc.green('ssr.noExternal')} ${pc.green(
          'https://vike.dev/broken-npm-package'
        )}`
      )
    } else {
      console.log(`Failed to import a package. To fix this: ${pc.green('https://vike.dev/broken-npm-package')}`)
    }

    return packageName
  }
}

const parseError = (error: unknown) => {
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

const parsePackageName = (errString: string) => {
  let packageName = ''
  const match = /import.*?from ?"(.*?)"/.exec(errString)
  if (match?.length && typeof match[1] === 'string') {
    packageName = match[1]
  }
  if (!packageName) {
    const firstNodeModulesLine = errString.split('\n').find((line) => line.includes('node_modules/'))

    if (firstNodeModulesLine) {
      packageName = firstNodeModulesLine.split('node_modules/').pop()!.split('/').slice(0, 2).join('/')
    }
  }
  const isNamespacedPackage = packageName.startsWith('@')
  if (!isNamespacedPackage) {
    packageName = packageName.split('/').shift()!
  }

  if (packageName) {
    if (!packageName.startsWith('"')) {
      packageName = `"${packageName}`
    }
    if (!packageName.endsWith('"')) {
      packageName = `${packageName}"`
    }
  }
  return packageName
}
