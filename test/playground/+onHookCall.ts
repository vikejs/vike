import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = {
  sync: (hook, context) => {
    console.log('before sync hook', hook.name, hook.filePath)
    hook.call()
    console.log('after sync hook', hook.name)
  },
  async: async (hook, context) => {
    console.log('before async hook', hook.name, hook.filePath)
    await hook.call()
    console.log('after async hook', hook.name)
  },
}
