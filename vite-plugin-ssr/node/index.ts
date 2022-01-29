export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'
export { RenderErrorPage } from './renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from './types'

import './page-files/setup'
import { importBuild } from './importBuild'
import { assertUsage, isBrowser } from '../shared/utils'
export const __private = { importBuild }

assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
