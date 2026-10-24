export default guard

import { abort } from 'vike/abort'
import type { PageContextClient } from '../../renderer/types'

function guard(pageContext: PageContextClient) {
  if (!pageContext.isHydration) throw abort()
}
