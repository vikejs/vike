export { formatEsbuildError }
export { isEsbuildFormattedError }
export { getEsbuildFormattedError }

import { formatMessages, PartialMessage } from 'esbuild'
import { assert, assertIsVitePluginCode, isObject } from '../../utils'

assertIsVitePluginCode()

const key = '_esbuildFormatted'

async function formatEsbuildError(err: unknown): Promise<void> {
  assert(isObject(err))
  if (err.errors) {
    const msgs = await formatMessages(err.errors as any, {
      kind: 'error',
      color: true
    })
    err[key] = msgs.map((m) => m.trim()).join('\n')
  }
}

function isEsbuildFormattedError(err: unknown): err is { [key]: string } {
  if (!isObject(err)) return false
  if (!(key in err)) return false
  assert(typeof err[key] === 'string')
  return true
}

function getEsbuildFormattedError(err: unknown): null | string {
  if (!isEsbuildFormattedError(err)) return null
  return err[key]
}

/*
function hasEsbuildError(err: Record<string, unknown>): err is Record<string, unknown> & { errors: PartialMessage[] } {
  if(!('errors' in err)) return false
  if(!Array.isArray(err.errors)) return false
  //if(err.errors.some(e => typeof e !== 'string')) return false
  return true
}
*/
