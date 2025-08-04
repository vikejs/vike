import type { Config } from 'vike/types'
import vikeCloudflare from 'vike-cloudflare/config'

export default {
  prerender: {
    enable: true,
    keepDistServer: true,
  },
  extends: [vikeCloudflare],
} satisfies Config
