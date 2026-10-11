export { renderPage }

import { renderPageServer, type PageContextInit } from './renderPageServer.js'
import { assertPlusMiddlewareApplied } from './middlewares.js'
import '../assertEnvServer.js'

// The app's renderPage(): Vike's own server and `vike(app)` call renderPageServer() instead
async function renderPage<PageContextUserAdded extends {}, PageContextInitUser extends PageContextInit>(
  ...args: [pageContextInit: PageContextInitUser]
): ReturnType<typeof renderPageServer<PageContextUserAdded, PageContextInitUser>> {
  await assertPlusMiddlewareApplied()
  return renderPageServer<PageContextUserAdded, PageContextInitUser>(...args)
}
