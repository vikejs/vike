import '../assertEnvClient.js'

export { removeFoucBuster }

import { assert } from '../../utils/assert.js'

// See also:
// - Alternative approach of exactly injecting what Vite injects:
//   - https://github.com/remix-run/remix/issues/8830#issuecomment-1968368351
//   - https://github.com/rakkasjs/rakkasjs/blob/7d75ccc915e93bca04e6bab37dc6abdb68a85e4a/packages/rakkasjs/src/features/pages/middleware.tsx#L701
// - https://github.com/remix-run/remix/issues/8830

function removeFoucBuster() {
  // In production removeFoucBuster() is expected to be have been removed by tree shaking
  assert(import.meta.env.DEV)
  let sleep = 2
  setTimeout(runClean, sleep)

  return

  function runClean() {
    const isCleaned = clean()
    if (!isCleaned) {
      if (sleep < 1000) sleep = 2 * sleep
      setTimeout(runClean, sleep)
    }
  }
}

function clean() {
  const VITE_ID = 'data-vite-dev-id'
  const injectedByVite = [...document.querySelectorAll(`style[${VITE_ID}]`)].map(
    (style) => style.getAttribute(VITE_ID)!,
  )

  // ```
  // <link rel="stylesheet" type="text/css" href="/renderer/css/index.css?direct">
  // <link rel="stylesheet" type="text/css" href="/renderer/Layout.css?direct">
  // ```
  const suffix = '?direct'
  // <link> defined by:
  //  - https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/server/runtime/html/injectAssets/inferHtmlTags.ts#L35
  //  - https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/server/runtime/renderPageServer/getPageAssets.ts#L68
  const injectedByVike = [...document.querySelectorAll(`link[rel="stylesheet"][type="text/css"][href$="${suffix}"]`)]

  let isCleaned = true
  injectedByVike.forEach((linkVike) => {
    const href = linkVike.getAttribute('href')
    assert(href && href.endsWith(suffix))
    let filePathAbsoluteUserRootDir = href.slice(0, -suffix.length)
    const prefix = '/@fs/'
    if (filePathAbsoluteUserRootDir.startsWith(prefix))
      filePathAbsoluteUserRootDir = filePathAbsoluteUserRootDir.slice(prefix.length)
    if (
      injectedByVite.some((filePathAbsoluteFilesystem) =>
        filePathAbsoluteFilesystem.endsWith(filePathAbsoluteUserRootDir),
      )
    ) {
      linkVike.remove()
    } else {
      isCleaned = false
    }
  })
  return isCleaned
}
