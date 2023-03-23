export { determinePageId }

import { assert } from '../../../../utils'

// somePath can be either:
//  - a file path (releative to the Vite's config.root)
//  - an import path of a npm package
function determinePageId(somePath: string): string {
  assert(!somePath.includes('\\'))

  let paths = somePath.split('/')
  assert(paths.length > 1)

  // Remove filename e.g. `+config.js`
  {
    const last = paths[paths.length - 1]!
    if (last.includes('.')) {
      paths = paths.slice(0, -1)
    }
  }

  const pageId2 = paths.join('/')
  return pageId2
}
