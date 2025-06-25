export { redirects }

// TO-DO/eventually: move all redirects here

import type { Config } from 'vike/types'

const redirects = {
  '/common-problems': '/common-issues',
  '/data-tools': '/data-fetching#page-data-with-tools',
} satisfies Config['redirects']
