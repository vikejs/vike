export { onPageTransitionStart }

import type { OnPageTransitionStartSync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartSync = (): ReturnType<OnPageTransitionStartSync> => {
  console.log('Page transition start')
  document.querySelector('body')!.classList.add('page-is-transitioning')
}
