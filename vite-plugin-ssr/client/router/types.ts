import type { PageContextBuiltIn } from '../../shared/types'

export type PageContextBuiltInClient = Partial<PageContextBuiltIn> &
  Pick<PageContextBuiltIn, 'Page' | 'pageExports' | 'exports' | 'url' | 'urlPathname' | 'urlParsed'> & {
    isHydration: boolean
  }
