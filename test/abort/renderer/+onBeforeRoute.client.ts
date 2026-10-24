export default onBeforeRoute

import { Abort } from 'vike/abort'
import { hasUnsavedChanges } from './unsavedChanges'

function onBeforeRoute() {
  if (hasUnsavedChanges() && !window.confirm('Leave this page? Your changes will be lost.')) {
    throw Abort()
  }
}
