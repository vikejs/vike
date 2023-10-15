// https://vike.dev/clientRouting
export { onPageTransitionEnd }

import type { OnPageTransitionEndAsync } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEndAsync = async (): ReturnType<OnPageTransitionEndAsync> => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
