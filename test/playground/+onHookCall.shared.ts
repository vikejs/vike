import type { Config, PageContext } from 'vike/types'
import { assert } from './utils/assert'

//*
const LOG = false
/*/
const LOG = true
//*/

type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]
export async function onHookCall(hook: Hook, pageContext: PageContext) {
  assert(pageContext === null || pageContext.isClientSide === true || pageContext.isClientSide === false)
  LOG &&
    console.log(
      // spellcheck-ignore
      'Befor hook:',
      hook.name,
      hook.filePath,
    )
  try {
    await hook.call()
  } catch (err) {
    LOG && console.log(`Error caught by +onHookCall for ${hook.name}:`, err)
    // By design, swallowing isn't possible
    if (Math.random() > 0.5) throw err
  } finally {
    LOG && console.log('After hook:', hook.name, hook.filePath)
  }
}
