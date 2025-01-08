// https://vike.dev/onPageTransitionStart
export { onPageTransitionStart }

import type { OnPageTransitionStartAsync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartAsync = async (): ReturnType<OnPageTransitionStartAsync> => {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
