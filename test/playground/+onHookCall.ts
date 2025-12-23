import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, context) => {
  // spellcheck-ignore
  console.log('Befor hook:', hook.name, hook.filePath)
  try {
    await hook.call()
  } catch (err) {
    // Swallowing isn't possible — that's a good thing?
    console.log(`Error caught by +onHookCall for ${hook.name}:`, err)
  } finally {
    console.log('After hook:', hook.name, hook.filePath)
  }
}
