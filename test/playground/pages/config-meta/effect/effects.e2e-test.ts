import { expect, test } from '@brillout/test-e2e'
import { fetchConfigJson } from '../../../utils/fetchConfigJson'

function testSettingEffect() {
  test('Setting Effect - Not applied', async () => {
    let json = await fetchConfigJson('/config-meta/effect/without-effect')

    expect(json).to.deep.equal({
      isBrowser: false,
      withEffect: 'undefined',
      dependent: 'undefined'
    })
  })

  test('Setting Effect - Applied', async () => {
    let json = await fetchConfigJson('/config-meta/effect/with-effect')

    expect(json).to.deep.equal({
      isBrowser: false,
      withEffect: 'undefined',
      dependent: 'default @ /effect'
    })
  })
}

export default [testSettingEffect]
