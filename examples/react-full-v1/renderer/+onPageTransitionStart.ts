export { onPageTransitionStart }

import type { OnPageTransitionStart } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStart = (): ReturnType<OnPageTransitionStart> => {
  console.log('Page transition start')
  document.querySelector('body')!.classList.add('page-is-transitioning')
}
