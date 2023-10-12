export type { PageContextClient, PageContextServer } from 'vike/types'

export type ReactComponent = () => JSX.Element

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: ReactComponent
    }
  }
}
