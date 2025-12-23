import type { Config } from 'vike/types'

export const onHookCall: Config['onHookCall'] = async (hook, context) => {
  console.log(
    'Befor hook:',
    hook.name,
    hook.filePath,
    `sync:${hook.sync}`,
    `!!pageContext:${!!context.pageContext}`,
    `!!globalContext:${!!context.globalContext}`,
  )
  await hook.call()
  console.log('After hook:', hook.name, hook.filePath)
}
