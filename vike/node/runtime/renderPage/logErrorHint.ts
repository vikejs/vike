export { logErrorHint }

// For ./logErrorHint/getErrorHint.spec.ts
export { getErrorHint }

import { formatHintLog, isObject } from '../utils.js'
import pc from '@brillout/picocolors'

const hintDefault = 'The error seems to be a CJS/ESM issue, see https://vike.dev/broken-npm-package'

const knownErrors = [
  {
    errMsg: 'jsxDEV is not a function',
    link: 'https://github.com/vikejs/vike/issues/1469#issuecomment-1919518096',
    shouldMentionNodeModules: false
  },
  {
    errMsg:
      'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components)',
    link: 'https://vike.dev/broken-npm-package#react-invalid-component',
    shouldMentionNodeModules: false
  },
  {
    // ```
    // Error [RollupError]: Could not resolve "../dist/client/assets.json" from "renderer/+onRenderHtml.tsx"
    // ```
    errMsg: 'assets.json',
    link: 'https://vike.dev/getGlobalContext',
    shouldMentionNodeModules: false
  },
  {
    errMsg: /Named export.*not found/i,
    link: 'https://vike.dev/broken-npm-package#named-export-not-found',
    shouldMentionNodeModules: false
  },
  {
    errMsg: /Named export.*not found/i,
    link: 'https://vike.dev/broken-npm-package#named-export-not-found'
  },
  { errMsg: 'ERR_UNSUPPORTED_DIR_IMPORT' },
  { errMsg: 'is not exported' },
  { errMsg: 'ERR_REQUIRE_ESM' },
  { errMsg: 'Must use import' },

  { errMsg: /Cannot find \S+ '(\S+)' imported from (\S+)/ },

  { errMsg: 'ERR_UNKNOWN_FILE_EXTENSION' },
  { errMsg: /Unknown file extension "\S+" for (\S+)/ },

  // `SyntaxError: Cannot use import statement outside a module`.
  {
    errMsg: 'Cannot use import statement',
    // Since user code is always ESM, this error must always originate from an npm package.
    shouldMentionNodeModules: false
  },

  // `SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.`
  {
    errMsg: /Named export.*not found/,
    // It seems that this always points to an npm package import.
    shouldMentionNodeModules: false
  },

  // Using CJS inside ESM modules.
  { errMsg: 'require is not a function' },
  { errMsg: 'exports is not defined' },
  { errMsg: 'module is not defined' },
  { errMsg: 'window is not defined' },
  { errMsg: 'not defined in ES' },
  { errMsg: "Unexpected token 'export'" },

  { errMsg: 'Cannot read properties of undefined' }
]

function logErrorHint(error: unknown): void {
  /* Collect errors for ./logErrorHint.spec.ts
  collectError(error)
  //*/
  const hint = getErrorHint(error)
  if (hint) logHint(hint)
}
function getErrorHint(error: unknown): null | string {
  {
    const knownErr = isKnownError(error)
    if (knownErr) {
      if (knownErr.link) {
        return `To fix this error, see ${knownErr.link}`
      } else {
        return hintDefault
      }
    }
  }

  return null
}
function logHint(hint: string) {
  hint = formatHintLog(hint)
  hint = pc.bold(hint)
  console.error(hint)
}

function isKnownError(error: unknown) {
  const anywhere = getAnywhere(error)
  const mentionsNodeModules = anywhere.includes('node_modules')
  const knownErr = knownErrors.find((knownErorr) => {
    if (!includes(anywhere, knownErorr.errMsg)) return false
    if (knownErorr.shouldMentionNodeModules !== false && !mentionsNodeModules) return false
    return true
  })
  if (!knownErr) return false
  return knownErr
}

function includes(str1: string | null, str2: string | RegExp): boolean {
  if (!str1) return false
  if (str2 instanceof RegExp) {
    let { flags } = str2
    if (!flags.includes('i')) flags += 'i'
    const regex = new RegExp(str2.source, flags)
    return regex.test(str1)
  }
  if (typeof str2 === 'string') {
    return str1.toLowerCase().includes(str2.toLowerCase())
  }
  return false
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
