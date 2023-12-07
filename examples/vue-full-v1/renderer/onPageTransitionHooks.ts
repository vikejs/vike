// https://vike.dev/onHydrationEnd
export { onHydrationEnd }
// https://vike.dev/onPageTransitionStart
export { onPageTransitionStart }
// https://vike.dev/onPageTransitionEnd
export { onPageTransitionEnd }

import type { OnHydrationEndAsync, OnPageTransitionEndAsync, OnPageTransitionStartAsync } from 'vike/types'

const onHydrationEnd: OnHydrationEndAsync = async (): ReturnType<OnHydrationEndAsync> => {
  console.log('Hydration finished; page is now interactive.')
}
const onPageTransitionStart: OnPageTransitionStartAsync = async (): ReturnType<OnPageTransitionStartAsync> => {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
const onPageTransitionEnd: OnPageTransitionEndAsync = async (): ReturnType<OnPageTransitionEndAsync> => {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
