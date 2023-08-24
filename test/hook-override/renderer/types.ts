export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }

import type {
  PageContextBuiltInServer,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
} from 'vite-plugin-ssr/types'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  onBeforeRender1WasCalled?: unknown
  onBeforeRender2WasCalled?: unknown
  onBeforeRenderEnv?: unknown
}

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
