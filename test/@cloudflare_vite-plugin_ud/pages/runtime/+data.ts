export { data }
export type Data = ReturnType<typeof data>

import type { PageContextServer } from 'vike/types'

function data(pageContext: PageContextServer) {
  const { runtime, req, res } = pageContext as { runtime?: unknown; req?: unknown; res?: unknown }
  return {
    runtime: runtime !== undefined,
    req: req === null ? null : typeof req,
    res: res === null ? null : typeof res,
  }
}
