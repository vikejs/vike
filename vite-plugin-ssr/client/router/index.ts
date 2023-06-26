// TODO/v1-release - move:
//   import { navigate, prefetch } from 'vite-plugin-ssr/client/router'
// to:
//   import { navigate, prefetch } from 'vite-plugin-ssr'
// Use dependency injection to make the imports isomorphic.
export { navigate } from './navigate'
export { prefetch } from './prefetch'
export type { PageContextBuiltInClient } from './types'
