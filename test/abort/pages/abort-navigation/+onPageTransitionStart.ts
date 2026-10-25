export default onPageTransitionStart

import { abort } from 'vike/abort'

function onPageTransitionStart() {
  if (!window.confirm('Leave this page?')) throw abort()
}
