import type { Config } from 'vike/types'
import vikeCloudflare from 'vike-cloudflare/config'

export default {
  prerender: true,
  extends: [vikeCloudflare],
} satisfies Config
