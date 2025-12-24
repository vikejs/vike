import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, context) => {
  // spellcheck-ignore
  console.log('Befor hook:', hook.name, hook.filePath)
  try {
    await hook.call()
  } catch (err) {
    // Swallowing isn't possible — that's a good thing?
    console.log(`Error caught by +onHookCall for ${hook.name}:`, err)
    // Why do we need this line to avoid the CI from breaking? If we remove it we get:
    // ```
    // [/test/playground/test-preview.test.ts][npm run preview][Browser Error] Error: [vike][Error] The guard() hook defined by /pages/guard-client-only/+guard.client.ts timed out: it didn't finish after 30 seconds (https://vike.dev/hooksTimeout)
    // ```
    // throw err
  } finally {
    console.log('After hook:', hook.name, hook.filePath)
  }
}
