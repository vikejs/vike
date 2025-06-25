export { redirects }

// TO-DO/eventually: move all redirects here

import type { Config } from 'vike/types'

const redirects = {
  '/common-problems': '/common-issues',
} satisfies Config['redirects']
