export { createPageContextShared }

import { objectAssign } from './utils.js'

function createPageContextShared<T extends object>(pageContextCreated: T) {
  objectAssign(
    pageContextCreated,
    {
      _isPageContextObject: true
    },
    true
  )

  return pageContextCreated
}
