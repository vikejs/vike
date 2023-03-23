export { determinePageId }

import { assert, isNpmPackageImportPath } from '../../../../utils'

// somePath can be either:
//  - a file path (releative to the Vite's config.root)
//  - an import path of a npm package
function determinePageId(somePath: string): string {
  assert(!somePath.includes('\\') && (somePath.startsWith('/') || isNpmPackageImportPath(somePath)))

  let paths = somePath.split('/')
  assert(paths.length > 1)

  // Remove filename e.g. `+config.js`
  {
    const last = paths[paths.length - 1]!
    if (last.includes('.')) {
      paths = paths.slice(0, -1)
    }
  }

  const pageId = paths.join('/')

  assert(pageId.startsWith('/') || isNpmPackageImportPath(pageId))
  assert(
    !pageId.endsWith('/') ||
      // Unlikely, but may happen
      pageId === '/'
  )

  return pageId
}
