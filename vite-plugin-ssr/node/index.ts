import './page-files/setup'

export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'

export type {
  GetPageProps,
  GetPage,
  OnInitPageContext,
  GetPageContext
} from './types'

import { importBuild } from './importBuild'

export const __private = { importBuild }
