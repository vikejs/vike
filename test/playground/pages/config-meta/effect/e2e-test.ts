export { testSettingEffect }

import { expect, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../retrievePageContext'

function testSettingEffect() {
  test('Setting Effect - Not applied', async () => {
    let json = await retrievePageContext('/config-meta/effect/without-effect')

    expect(json).to.deep.equal({
      settingWithEffect: 'undefined',
      dependentSetting: 'undefined',
    })
  })

  test('Setting Effect - Applied', async () => {
    let json = await retrievePageContext('/config-meta/effect/with-effect')

    expect(json).to.deep.equal({
      settingWithEffect: 'undefined',
      dependentSetting: 'default @ /effect',
    })
  })
}
