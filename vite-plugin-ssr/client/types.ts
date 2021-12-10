import type { BuiltInPageContext } from '../node/types'

export type PageContextBuiltInClient = Partial<BuiltInPageContext> &
  Pick<BuiltInPageContext, 'Page' | 'pageExports'> & {
    isHydration: boolean
  }
