export { testDefaultAndClearSuffixes }

import { expect, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../retrievePageContext'

function testDefaultAndClearSuffixes() {
  test('default suffix acts as fallback; clear suffix resets ancestry', async () => {
    expect(await retrievePageContext('/config-meta/default-clear')).to.deep.equal({
      settingCumulativeString: ['default-root'],
    })

    expect(await retrievePageContext('/config-meta/default-clear/only-default')).to.deep.equal({
      settingCumulativeString: ['default-root'],
    })

    expect(await retrievePageContext('/config-meta/default-clear/with-non-default')).to.deep.equal({
      settingCumulativeString: ['child-non-default'],
    })

    expect(await retrievePageContext('/config-meta/default-clear/with-clear')).to.deep.equal({
      settingCumulativeString: ['clear-here'],
    })

    expect(await retrievePageContext('/config-meta/default-clear/with-clear/child')).to.deep.equal({
      settingCumulativeString: ['child-after-clear', 'clear-here'],
    })
  })
}
