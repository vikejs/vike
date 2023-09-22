export function isVitest(): boolean {
  return typeof process !== 'undefined' && typeof process.env !== 'undefined' && 'VITEST' in process.env
}
