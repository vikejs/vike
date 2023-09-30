export type { PageContextClient, PageContextServer } from 'vike/types'

export type ReactComponent = () => JSX.Element

// Note: extending globally the `Vike.PageContext` interface directly impacts
// the `PageContextServer` and `PageContextClient` types.
declare global {
  namespace Vike {
    interface PageContext {
      Page: ReactComponent
    }
  }
}
