// https://vike.dev/onPageTransitionEnd
export { onPageTransitionEnd }

import type { PageContextClient } from 'vike/types'

const onPageTransitionEnd = async (pageContext: PageContextClient) => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
