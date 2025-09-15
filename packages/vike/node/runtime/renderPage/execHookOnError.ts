export { execHookOnError }

import { execHookServer, type PageContextExecHookServer } from './execHookServer.js'

async function execHookOnError(
  pageContext: {
    pageId: string
    errorWhileRendering: Error
  } & PageContextExecHookServer,
): Promise<void> {
  const hooks = await execHookServer('onError', pageContext)
  const onErrorHook = hooks[0] // TO-DO/soon/cumulative-hooks: support cumulative
  if (onErrorHook) {
    // The onError hook doesn't return anything, it's just for side effects like logging
    // We don't need to process the return value
  }
}
