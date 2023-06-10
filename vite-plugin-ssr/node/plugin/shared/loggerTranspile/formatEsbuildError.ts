export { formatEsbuildError }
export { getEsbuildFormattedError }

import { formatMessages } from 'esbuild'
import { assert, assertIsVitePluginCode, isObject } from '../../utils'

assertIsVitePluginCode()

const key = '_esbuildFormatted'

async function formatEsbuildError(err: unknown) {
  assert(isObject(err))
  if (err.errors) {
    const msgs = await formatMessages(err.errors as any, {
      kind: 'error',
      color: true
    })
    err[key] = msgs.map((m) => m.trim()).join('\n')
  }
}

function getEsbuildFormattedError(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!(key in err)) return null
  const esbuildFromattedError = err[key]
  assert(typeof esbuildFromattedError === 'string')
  return esbuildFromattedError
}
