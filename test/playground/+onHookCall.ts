import type { Config } from 'vike/types'
import { assert } from './utils/assert'

export const onHookCall: Config['onHookCall'] = async (hook, pageContext) => {
  const startTime = Date.now()

  const result = await hook.call()

  const endTime = Date.now()

  console.log(`onHookCall ${hook.name}:${hook.filePath} took ${endTime - startTime}ms`)

  return result
}
