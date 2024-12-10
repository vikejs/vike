import { expect, test } from '@brillout/test-e2e'
import { fetchConfigJson } from '../../../utils/fetchConfigJson'

function testSettingInheritedByDescendants() {
  test('Standard and cumulative settings are inherited correctly', async () => {
    expect(await fetchConfigJson('/config-meta/cumulative')).to.deep.equal({
      isBrowser: false,
      standard: { nested: 'default for standard @ /cumulative' },
      cumulative: [{ nested: 'default for cumulative @ /cumulative' }]
    })

    expect(await fetchConfigJson('/config-meta/cumulative/nested')).to.deep.equal({
      isBrowser: false,
      standard: { nested: 'override for standard @ /nested' },
      cumulative: [{ nested: 'override for cumulative @ /nested' }, { nested: 'default for cumulative @ /cumulative' }]
    })

    expect(await fetchConfigJson('/config-meta/cumulative/nested/no-overrides')).to.deep.equal({
      isBrowser: false,
      standard: { nested: 'override for standard @ /nested' },
      cumulative: [{ nested: 'override for cumulative @ /nested' }, { nested: 'default for cumulative @ /cumulative' }]
    })

    expect(await fetchConfigJson('/config-meta/cumulative/nested/deeply-nested')).to.deep.equal({
      isBrowser: false,
      standard: { nested: 'override for standard @ /deeply-nested' },
      cumulative: [
        { nested: 'override for cumulative @ /deeply-nested' },
        { nested: 'override for cumulative @ /nested' },
        { nested: 'default for cumulative @ /cumulative' }
      ]
    })
  })
}

export default [testSettingInheritedByDescendants]
