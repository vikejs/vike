import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, context) => {
  console.log('Befor hook:', hook.name, hook.filePath)
  try {
    await hook.call()
  } catch (err) {
    // Swallowing isn't possible — that's a good thing?
    console.log('Error catched by +onHookCall:', err)
  } finally {
    console.log('After hook:', hook.name, hook.filePath)
  }
}
