import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  title: 'Big Playground',
  redirects: {
    // TEST: redirect to email
    '/mail': 'mailto:some@example.com'
  },
  extends: [vikeReact],
  meta: {
    frontmatter: {
      env: { server: true }
    }
  }
} satisfies Config
