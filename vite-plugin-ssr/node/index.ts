import './page-files/setup'

export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'

export type {
  PageContextBuiltIn,
  OnBeforeRenderPageContextInternal,
  VitePluginSsr,
  GetPageProps,
  GetPage,
} from './types'
export { withTypescript } from './types'

import { importBuild } from './importBuild'

export const __private = { importBuild }
