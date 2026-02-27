import type { PageContextClient } from 'vike/types'

export const onPageTransitionEnd = async (pageContext: PageContextClient) => {
  console.log('Page transition end')
  document.querySelector('body')?.classList.remove('page-is-transitioning')
}
