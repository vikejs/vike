export type { PageContext }

import type fetch from 'node-fetch'

type PageContext = {
  Page: React.ReactNode
  fetch?: typeof fetch
}
