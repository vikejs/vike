export { data }

// Also imported by +serverEntry.ts, see .testRun.ts
import { getEvaluations } from '../../server/shared'

function data() {
  return { sharedModuleEvaluations: getEvaluations() }
}
