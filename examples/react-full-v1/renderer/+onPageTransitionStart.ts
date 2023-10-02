import type { Config } from "vike/types"

const onPageTransitionStart: Config['onPageTransitionStart'] = (): void => {
  console.log('Page transition start')
  document.querySelector('body')!.classList.add('page-is-transitioning')
}
export default onPageTransitionStart
