import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, pageContext) => {
  // spellcheck-ignore
  console.log('Befor hook:', hook.name, hook.filePath)
  try {
    await hook.call()
  } catch (err) {
    // Swallowing isn't possible by design
    console.log(`Error caught by +onHookCall for ${hook.name}:`, err)
  } finally {
    console.log('After hook:', hook.name, hook.filePath)
  }
}
