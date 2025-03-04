export { logErrorHint }
// For ./logErrorHint/getErrorHint.spec.ts
export { getErrorHint }

import { assert, formatHintLog, isObject } from '../utils.js'
import pc from '@brillout/picocolors'

const hintDefault = 'The error could be a CJS/ESM issue, see https://vike.dev/broken-npm-package'
const hintLinkPrefix = 'To fix this error, see '

type Errors = {
  errMsg: string | RegExp
  link?: string
  mustMentionNodeModules?: false
}
const errorsMisc: Errors[] = [
  {
    errMsg: 'window is not defined',
    link: 'https://vike.dev/hints#window-is-not-defined',
    mustMentionNodeModules: false
  },
  {
    errMsg: 'jsxDEV is not a function',
    link: 'https://github.com/vikejs/vike/issues/1469#issuecomment-1919518096',
    mustMentionNodeModules: false
  },
  {
    // ```
    // Error [RollupError]: Could not resolve "../dist/client/assets.json" from "renderer/+onRenderHtml.tsx"
    // ```
    errMsg: 'assets.json',
    link: 'https://vike.dev/getGlobalContext',
    mustMentionNodeModules: false
  },
  {
    errMsg: 'ERR_UNKNOWN_FILE_EXTENSION',
    link: 'https://vike.dev/broken-npm-package#err-unknown-file-extension'
  }
]
const reactInvalidEelement = 'https://vike.dev/broken-npm-package#react-invalid-component'
const errorsReact: Errors[] = [
  {
    errMsg:
      'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components)',
    link: reactInvalidEelement,
    // The stack trace can be user-land while the import is coming from node_modules
    mustMentionNodeModules: false
  },
  {
    errMsg: 'Objects are not valid as a React child',
    link: reactInvalidEelement,
    mustMentionNodeModules: false
  },
  {
    // React's "Invalid hook call.", see https://github.com/vikejs/vike/discussions/1637#discussioncomment-9424712
    errMsg: "Cannot read properties of null (reading 'useContext')"
  }
]
const errorsCjsEsm_withPreciseLink: Errors[] = [
  {
    // `SyntaxError: Named export '${exportName}' not found. The requested module '${packageName}' is a CommonJS module, which may not support all module.exports as named exports.`
    errMsg: /Named export.*not found/i,
    link: 'https://vike.dev/broken-npm-package#named-export-not-found',
    // It seems that this always points to an npm package import.
    mustMentionNodeModules: false
  }
]
const errorsCjsEsm: Errors[] = [
  { errMsg: 'ERR_UNSUPPORTED_DIR_IMPORT' },
  { errMsg: 'ERR_REQUIRE_ESM' },
  { errMsg: 'Must use import' },

  { errMsg: /Cannot find \S+ '(\S+)' imported from (\S+)/ },

  { errMsg: 'ERR_UNKNOWN_FILE_EXTENSION' },
  { errMsg: /Unknown file extension "\S+" for (\S+)/ },

  // `SyntaxError: Cannot use import statement outside a module`.
  {
    errMsg: 'Cannot use import statement',
    // Since user code is always ESM, this error must always originate from an npm package.
    mustMentionNodeModules: false
  },

  { errMsg: 'is not exported' },

  { errMsg: 'Cannot read properties of undefined' },
  { errMsg: '.default is not' },

  // Using CJS inside ESM modules.
  { errMsg: 'require is not a function' },
  { errMsg: 'exports is not defined' },
  { errMsg: 'module is not defined' },
  { errMsg: 'not defined in ES' },
  { errMsg: "Unexpected token 'export'" }
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
        return hintLinkPrefix + knownErr.link
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
  const knownErr = [
    //
    ...errorsMisc,
    ...errorsReact,
    ...errorsCjsEsm_withPreciseLink,
    ...errorsCjsEsm
  ].find((knownErorr) => {
    if (!includesLowercase(anywhere, knownErorr.errMsg)) return false
    if (knownErorr.mustMentionNodeModules !== false && !includesLowercase(anywhere, 'node_modules')) return false
    return true
  })
  if (!knownErr) return false
  return knownErr
}

function includesLowercase(str: string, substr: string | RegExp): boolean {
  if (substr instanceof RegExp) {
    let { flags } = substr
    if (!flags.includes('i')) flags += 'i'
    const regex = new RegExp(substr.source, flags)
    return regex.test(str)
  }
  if (typeof substr === 'string') {
    return str.toLowerCase().includes(substr.toLowerCase())
  }
  assert(false)
}

function getAnywhere(error: unknown): string {
  const code = getErrCode(error)
  const message = getErrMessage(error)
  const stack = getErrStack(error)
  const anywhere = [code, message, stack].filter(Boolean).join('\n')
  return anywhere
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
