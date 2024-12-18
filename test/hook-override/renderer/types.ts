export type { GlobalData, PerPageData }

type Page = (pageProps: PageProps) => JSX.Element
type PageProps = Record<string, unknown>

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      globalOnBeforeRenderWasCalled?: boolean
      globalOnBeforeRenderWasCalledInEnv?: 'client' | 'server'
      perPageOnBeforeRenderWasCalled?: boolean
      perPageOnBeforeRenderWasCalledInEnv?: 'client' | 'server'
    }
  }
}

type GlobalData = {
  globalDataWasCalled?: boolean
  globalDataWasCalledInEnv?: 'client' | 'server'
}
type PerPageData = {
  perPageDataWasCalled?: boolean
  perPageDataWasCalledInEnv?: 'client' | 'server'
}
