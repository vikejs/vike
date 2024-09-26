import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  title: 'Big Playground',
  extends: [vikeReact],
  meta: {
    frontmatter: {
      env: { server: true }
    }
  },
  prefetch: {
    pageContext: false
  }
} satisfies Config
