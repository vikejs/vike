export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import { redirect } from 'vike/abort'

async function onBeforeRenderClient(pageContext: PageContextClient) {
  throw redirect("/about")
}
