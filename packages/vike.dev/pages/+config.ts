export { config }

import docpress from '@brillout/docpress/config'
import type { Config } from 'vike/types'

const config = {
  extends: docpress,
  redirects: {
    '/common-problems': '/common-issues',
  },
} satisfies Config
