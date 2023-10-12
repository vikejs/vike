export { onPageTransitionEnd }

import type { OnPageTransitionEndSync } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEndSync = (): ReturnType<OnPageTransitionEndSync> => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
