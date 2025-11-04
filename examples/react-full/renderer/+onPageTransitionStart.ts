// https://vike.dev/onPageTransitionStart
export { onPageTransitionStart }

import type { PageContextClient } from 'vike/types'

const onPageTransitionStart = async (pageContext: PageContextClient) => {
  console.log('Page transition start')
  document.querySelector('body')!.classList.add('page-is-transitioning')
}
