export { formatFrameError }
export { isFrameError }
// For ./formatFrameError.spec.ts
export { getErrMsg }

// Copied & adapted from https://github.com/vitejs/vite/blob/9c114c5c72a6af87e3330d5573362554b4511265/packages/vite/src/node/server/middlewares/error.ts

import pc from '@brillout/picocolors'
import { assert, escapeRegex, getFilePathVite, isObject } from '../../utils'

// Subset of RollupError
type FrameError = { id: string; frame: string; message: string; plugin?: string }

function isFrameError(err: unknown): err is FrameError {
  if (!isObject(err)) return false
  const { id, frame, message } = err
  return typeof frame === 'string' && typeof id === 'string' && typeof message === 'string'
}

function formatFrameError(err: FrameError, userRootDir: string): string {
  assert(isFrameError(err))
  let { id, frame } = err
  frame = frame.trim()
  assert(frame)

  const msgFirstLine = [
    pc.red('Failed to transpile'),
    pc.red(pc.bold(getFilePathVite(id, userRootDir))),
    pc.red('because:')
  ].join(' ')

  const errMsg = getErrMsg(err)

  const msg = [msgFirstLine, errMsg, pc.yellow(frame)].filter(Boolean).join('\n')
  return msg

  /* Showing the error layover didn't properly work last time we tried. But we don't really need it, do we?
  server.ws.send({
    type: 'error',
    err: prepareError(err)
  })
  */
}

function getErrMsg(err: FrameError): string {
  const { id, frame } = err
  let errMsg = err.message

  // errMsg = removeRedundantFrame(errMsg, err)
  // errMsg = stripAnsi(errMsg)
  // errMsg = errMsg.split(stripAnsi(frame)).join('')

  const trail = /(?:\:|)(?:\s|$)/
  // Remove redundant message: "Transform failed with 1 error:" (redundant since we already print an intro message)
  errMsg = errMsg.split(reg([/Transform failed with \d* error(?:s|)/, trail], 'gi')).join('')
  // Remove "/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:8:" (redundant since we already print the filename)
  const pos = /(?:\:\d+|)/
  errMsg = errMsg.split(reg([id, pos, pos, trail], 'gi')).join('')
  // Remove "ERROR:" (useless)
  errMsg = errMsg.split(reg(['ERROR:', trail])).join('')
  // Remove "Internal server error:" (useless)
  errMsg = errMsg.split(reg(['Internal server error', trail])).join('')

  errMsg = errMsg.trim()
  if (frame.includes(errMsg)) errMsg = ''

  return errMsg
}

function removeRedundantFrame(errMsg: string, err: FrameError) {
  //if( !err.plugin?.includes('babel')) return errMsg
  //return errMsg
}

function reg(parts: (RegExp | string)[], flags: string = '') {
  return new RegExp(parts.map((part) => (typeof part === 'string' ? escapeRegex(part) : part.source)).join(''), flags)
}
