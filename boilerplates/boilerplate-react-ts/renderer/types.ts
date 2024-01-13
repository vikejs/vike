// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      urlPathname: string
      exports: {
        documentProps?: {
          title?: string
          description?: string
        }
      }
    }
  }
}

type Page = ({ data }: { data: unknown }) => React.ReactElement

// Tell TypeScript this file isn't an ambient module
export {}
