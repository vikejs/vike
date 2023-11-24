export {}

type Page = (pageProps: PageProps) => React.ReactElement
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

    // https://vike.dev/data
    interface Data {
      globalDataWasCalled?: boolean
      globalDataWasCalledInEnv?: 'client' | 'server'
      perPageDataWasCalled?: boolean
      perPageDataWasCalledInEnv?: 'client' | 'server'
    }
  }
}
