import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  title: 'Big Playground',
  prerenderSetOverEffect: {
    // TEST: prerender.noExtraDir
    noExtraDir: true
  },
  redirects: {
    // TEST: redirect to email
    '/mail': 'mailto:some@example.com'
  },
  extends: [vikeReact],
  meta: {
    frontmatter: {
      env: { server: true }
    }
  },
  passToClient: ['staticUrls']
} satisfies Config
