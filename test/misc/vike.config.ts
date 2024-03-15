import type { ConfigGlobal } from 'vike/types'

export default {
  prerender: {
    noExtraDir: true
  },
  redirects: {
    '/mail': 'mailto:some@example.com'
  }
} satisfies ConfigGlobal
