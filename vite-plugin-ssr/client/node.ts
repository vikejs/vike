import { assertUsage } from './utils'
assertUsage(
  false,
  "`import { something } from 'vite-plugin-ssr'` is forbidden on the client-side. Did you mean `import { something } from 'vite-plugin-ssr/client/router'` instead?"
)
