export { config }

import type { ConfigGlobal } from 'vike/types'

const config = {
  prerender: true,
  clientRouting: true,
  hooksTimeout: {
    data: {
      error: 30 * 1000,
      warning: 10 * 1000
    }
  }
} satisfies ConfigGlobal
