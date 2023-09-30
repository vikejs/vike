export type { PageContextServer } from 'vike/types'

export type ReactComponent = () => JSX.Element
export type PageContext = {
  Page: ReactComponent
}

declare global {
  namespace Vike {
    interface PageContext {
      Page: ReactComponent
    }
  }
}
