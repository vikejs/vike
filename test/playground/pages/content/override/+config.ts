import type { Config } from 'vike/types'

export default {
  route: '/content/override.json',
  // Pre-rendered files are served by the static host, which ignores headersResponse
  prerender: false,
  headersResponse: {
    'Content-Type': 'application/feed+json',
    'Cache-Control': 'public, max-age=60',
  },
} satisfies Config
