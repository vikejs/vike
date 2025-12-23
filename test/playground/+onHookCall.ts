import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, context) => {
  console.log('before async hook', hook.name, hook.filePath)
  await hook.call()
  console.log('after async hook', hook.name)
}
