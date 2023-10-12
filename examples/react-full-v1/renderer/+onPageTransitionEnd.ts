export { onPageTransitionEnd }

import type { OnPageTransitionEnd } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEnd = (): ReturnType<OnPageTransitionEnd> => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
