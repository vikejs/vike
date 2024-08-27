export type { PageProps }

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
    }
  }
}
