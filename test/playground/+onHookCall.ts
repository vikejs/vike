import type { OnHookCall } from 'vike/types'

export const onHookCall: OnHookCall = async (hook, context) => {
  console.log('before hook', hook.name, hook.filePath)
  const result = await hook.call()
  console.log('after hook', hook.name)
  return result
}
