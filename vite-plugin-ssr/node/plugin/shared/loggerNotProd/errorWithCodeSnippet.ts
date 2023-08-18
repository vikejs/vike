// Prettify transpilation errors
//  - Doesn't work for optimize errors: https://gist.github.com/brillout/9b7bb78ae866558b292ea1b516a986ec

export { getPrettyErrorWithCodeSnippet }
export { isErrorWithCodeSnippet }
export { isEquivalentErrorWithCodeSnippet }
export type { ErrorWithCodeSnippet }

// For ./errorWithCodeSnippet.spec.ts
export { getPrettyErrMessage }

// Copied & adapted from https://github.com/vitejs/vite/blob/9c114c5c72a6af87e3330d5573362554b4511265/packages/vite/src/node/server/middlewares/error.ts

import pc from '@brillout/picocolors'
import {
  assert,
  escapeRegex,
  getFilePathVite,
  isObject,
  removeEmptyLines,
  stripAnsi,
  toPosixPath
} from '../../utils.js'

// Subset of RollupError
type ErrorWithCodeSnippet = { id: string; frame?: string; message?: string; plugin?: string }

function isErrorWithCodeSnippet(err: unknown): err is ErrorWithCodeSnippet {
  if (!isObject(err)) {
    return false
  }
  const { id, frame, message } = err
  if (typeof id !== 'string' || !id.trim()) {
    return false
  }
  if (typeof frame === 'string' && frame.trim()) {
    return true
  }
  if (typeof message === 'string' && containsCodeSnippet(message)) {
    return true
  }
  return false
}

function getPrettyErrorWithCodeSnippet(err: ErrorWithCodeSnippet, userRootDir: string): string {
  /* Uncomment to inspect and/or create fixture for ./errorWithCodeSnippet.spec.ts
  console.log('userRootDir', userRootDir)
  console.log('err.message', err.message)
  console.log('err.stack', (err as any).stack)
  console.log('err.pluginCode', (err as any).pluginCode)
  console.log('Object.keys(err)', Object.keys(err))
  console.log('err', err)
  // For copy-pasting errors while preserving terminal ANSI colors
  console.log(
    'JSON.stringify(err)',
    JSON.stringify({
      ...err,
      message: err.message,
      stack: (err as any).stack
    })
  )
  //*/

  assert(isErrorWithCodeSnippet(err))
  let { id, frame } = err

  const msgFirstLine = [
    pc.red('Failed to transpile'),
    pc.red(pc.bold(getFilePathVite(normalizeId(id), userRootDir))),
    pc.red('because:')
  ].join(' ')

  const errMsg = getPrettyErrMessage(err)

  if (errMsg && containsCodeSnippet(errMsg)) {
    // Conditionally swallowing frame is a risky move but worth it thanks to logErrorDebugNote()
    // We swallow frame because many tools set 'error.frame' to something rubbish, for example:
    //  - @vitejs/plugin-vue
    //  - @vitejs/plugin-react-swc
    //  - @mdx-js/rollup
    frame = undefined
  } else {
    assert(frame)
    frame = frame.trim()
    assert(frame)
    frame = pc.yellow(frame)
  }

  let msg = [msgFirstLine, errMsg, frame].filter(Boolean).join('\n')
  msg = removeEmptyLines(msg)

  /* Vite already does a fairly good job at showing a concise error in the layover
  server.ws.send({
    type: 'error',
    err: msg
  })
  */

  return msg
}

function getPrettyErrMessage(err: ErrorWithCodeSnippet): string | null {
  const { id, frame } = err
  let errMsg = err.message

  if (!errMsg || !errMsg.trim()) return null

  const trail = /(?:\:|)(?:\s|$)/
  // Remove "Transform failed with 1 error:" (redundant since we already print an intro message)
  errMsg = errMsg.split(reg([/Transform failed with \d* error(?:s|)/, trail], 'gi')).join('')
  // Remove "/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:8:" (redundant since we already print the filename)
  const pos = /(?:\:\d+|)/
  errMsg = errMsg.split(reg([id, pos, pos, trail], 'gi')).join('')
  errMsg = errMsg.split(reg([normalizeId(id), pos, pos, trail], 'gi')).join('')
  // Remove "ERROR:" (useless)
  errMsg = errMsg.split(reg(['ERROR:', trail])).join('')
  // Remove "Internal server error:" (useless)
  errMsg = errMsg.split(reg(['Internal server error', trail])).join('')

  if (containsCodeSnippet(errMsg)) {
    errMsg = removeStandaloneCodePosition(errMsg)
  }

  errMsg = errMsg.trim()
  if (frame && frame.includes(errMsg)) errMsg = ''

  return errMsg
}

function containsCodeSnippet(str: string) {
  str = stripAnsi(str)
  let codeBlockSize = 0
  for (const line of str.split('\n')) {
    if (!isCodeSnippetLine(line)) {
      codeBlockSize = 0
    } else {
      codeBlockSize++
    }
    if (codeBlockSize >= 3) {
      return true
    }
  }
  return false
}

function isCodeSnippetLine(line: string): boolean {
  // Babel
  if (/[\s\d>]*\|/.test(line)) return true
  // SWC
  if (/[\s\d>]*(╭─|│|·)/.test(line)) return true
  return false
}

function reg(parts: (RegExp | string)[], flags: string = '') {
  return new RegExp(parts.map((part) => (typeof part === 'string' ? escapeRegex(part) : part.source)).join(''), flags)
}

function removeStandaloneCodePosition(errMsg: string) {
  // Remove weird standalone code position " (2:7) "
  errMsg = errMsg
    .split('\n')
    .map((line) => {
      const posRE = /(\s|^)\(\d+:\d+\)(\s|$)/
      assert(posRE.test(' (1:2)'))
      assert(posRE.test('(13:42) '))
      if (!isCodeSnippetLine(line)) {
        line = line.split(posRE).join('')
      }
      return line
    })
    .join('\n')
  return errMsg
}

function isEquivalentErrorWithCodeSnippet(err1: unknown, err2: unknown): boolean {
  if (!isObject(err1) || !isObject(err2)) return false
  if (
    isDefinedAndSame(err1.message, err2.message) &&
    isDefinedAndSame(err1.frame, err2.frame) &&
    isDefinedAndSame(err1.id, err2.id)
  ) {
    return true
  }
  return false
}
function isDefinedAndSame(val1: unknown, val2: unknown) {
  return val1 && val1 === val2
}

function normalizeId(id: string): string {
  id = toPosixPath(id)
  // remove query
  id = id.split('?')[0]!
  return id
}
