import type { PageContextBuiltIn } from '../shared/types'

export type PageContextBuiltInClient = Partial<PageContextBuiltIn> &
  Pick<PageContextBuiltIn, 'Page' | 'pageExports' | 'exports'> & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     *
     * The `isBackwardNavigation` property only works with Client Routing. (The value is always `null` when using Server Routing.)
     */
    isBackwardNavigation: boolean | null
  }
