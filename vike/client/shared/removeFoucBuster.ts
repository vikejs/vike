export { removeFoucBuster }

import { assert } from './utils.js'

function removeFoucBuster() {
  assert(import.meta.env.DEV)

  let sleep = 2
  const runClean = () => {
    const isClean = clean()
    if (!isClean) {
      if (sleep < 1000) sleep = 2 * sleep
      setTimeout(runClean, sleep)
    }
  }
  setTimeout(runClean, sleep)
}

function clean() {
  const VITE_ID = 'data-vite-dev-id'
  const injectedByVite = [...document.querySelectorAll(`style[${VITE_ID}]`)].map(
    (style) => style.getAttribute(VITE_ID)!
  )

  // ```
  // <link rel="stylesheet" type="text/css" href="/renderer/css/index.css?direct">
  // <link rel="stylesheet" type="text/css" href="/renderer/Layout.css?direct">
  // ```
  const suffix = '?direct'
  // <link> defined by:
  //  - https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/node/runtime/html/injectAssets/inferHtmlTags.ts#L35
  //  - https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/node/runtime/renderPage/getPageAssets.ts#L68
  const injectedByVike = [...document.querySelectorAll(`link[rel="stylesheet"][type="text/css"][href$="${suffix}"]`)]

  let isClean = true
  injectedByVike.forEach((link) => {
    const filePathAbsoluteUserRootDir = link.getAttribute('href')!.slice(0, -suffix.length)
    if (
      injectedByVite.some((filePathAbsoluteFilesystem) =>
        filePathAbsoluteFilesystem.endsWith(filePathAbsoluteUserRootDir)
      )
    ) {
      link.remove()
    } else {
      isClean = false
    }
  })
  return isClean
}
