export { commonConfig }

import type { Plugin } from 'vite'

function commonConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:commonConfig',
    config: () => ({ spa: false }),
  }
}
