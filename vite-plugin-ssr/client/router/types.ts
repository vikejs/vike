import type { PageContextBuiltIn } from '../../shared/types'

export type PageContextBuiltInClient = Partial<PageContextBuiltIn> &
  Pick<PageContextBuiltIn, 'Page' | 'pageExports' | 'exports' | 'url' | 'urlOriginal' | 'urlPathname' | 'urlParsed'> & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     */
    isBackwardNavigation: boolean | null
  }
