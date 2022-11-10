import type { PageContextBuiltIn } from '../../shared/types'

export type PageContextBuiltInClient<Page = any> = Partial<PageContextBuiltIn<Page>> &
  Pick<
    PageContextBuiltIn<Page>,
    'Page' | 'pageExports' | 'exports' | 'exportsAll' | 'url' | 'urlOriginal' | 'urlPathname' | 'urlParsed'
  > & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     */
    isBackwardNavigation: boolean | null
  }
