export { data }

import { getEvaluations } from '../../server/shared'

function data() {
  return { sharedModuleEvaluations: getEvaluations() }
}
