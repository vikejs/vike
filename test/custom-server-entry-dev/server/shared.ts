// Imported by both +serverEntry.ts and pages/about/+data.ts => it should be evaluated only once (also in development)
const globalObject = globalThis as { sharedModuleEvaluations?: number }
globalObject.sharedModuleEvaluations = (globalObject.sharedModuleEvaluations ?? 0) + 1

export function getEvaluations() {
  return globalObject.sharedModuleEvaluations
}
