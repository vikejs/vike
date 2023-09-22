import { getExportPath } from './getExportPath.js'
import { expect, describe, it } from 'vitest'

describe('getExportPath()', () => {
  it('works', () => {
    expect(getExportPath(['default'])).toBe('export default')
    expect(getExportPath(['object'])).toBe('export { object }')
    expect(getExportPath(['default', 'prop'])).toBe('export default { prop }')
    expect(getExportPath(['object', 'prop'])).toBe('export { object { prop } }')
    expect(getExportPath(['object', 'nested'])).toBe('export { object { nested } }')
    expect(getExportPath(['object', 'nested', 'prop'])).toBe('export { object { nested { prop } } }')
    expect(getExportPath(['default', 'nested', 'prop'])).toBe('export default { nested { prop } }')
  })
  it('edge cases work', () => {
    expect(getExportPath(['*'])).toBe('export *')
  })
})
