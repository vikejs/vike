import type { PageContextBuiltIn } from '../../node/types'

export type PageContextBuiltInClient = Partial<PageContextBuiltIn> &
  Pick<PageContextBuiltIn, 'Page' | 'pageExports' | 'url' | 'urlPathname' | 'urlNormalized' | 'urlParsed'> & {
    isHydration: boolean
  }
