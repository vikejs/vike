export { testSettingEffect }

import { expect, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../retrievePageContext'

function testSettingEffect() {
  test('Setting Effect - Not applied', async () => {
    expect(await retrievePageContext('/config-meta/effect/without-effect')).to.deep.equal({
      settingWithEffect: 'undefined',
      dependentSetting: 'undefined',
    })
  })

  test('Setting Effect - Applied', async () => {
    expect(await retrievePageContext('/config-meta/effect/with-effect')).to.deep.equal({
      settingWithEffect: 'undefined',
      dependentSetting: 'default @ /effect',
    })
  })

  test('Setting Effect - Applied with Value', async () => {
    expect(await retrievePageContext('/config-meta/effect/with-effect-set-value')).to.deep.equal({
      settingWithEffect: 'undefined',
      dependentSetting: 'set by settingWithEffect',
    })
  })
}
