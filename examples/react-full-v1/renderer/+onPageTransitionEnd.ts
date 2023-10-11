export { onPageTransitionEnd }

import type { Config } from "vike/types"

const onPageTransitionEnd: Config['onPageTransitionEnd'] = (): void => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
