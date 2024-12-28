import { expect, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../../../utils/retrievePageContext'

function testSettingOnlyAvailableInCorrectEnv() {
  test('Custom Setting Env - Client-only', async () => {
    let json = await retrievePageContext('/config-meta/env/client', { clientSide: true })

    expect(json).to.deep.equal({
      settingServerOnly: 'undefined',
      settingClientOnly: { nested: 'clientOnly @ /env' },
      settingConfigOnly: 'undefined'
    })
  })

  test('Custom Setting Env - Server-only', async () => {
    let json = await retrievePageContext('/config-meta/env/server')

    expect(json).to.deep.equal({
      settingServerOnly: { nested: 'serverOnly @ /env' },
      settingClientOnly: 'undefined',
      settingConfigOnly: 'undefined'
    })
  })
}

export default [testSettingOnlyAvailableInCorrectEnv]
