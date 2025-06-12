export { testSettingOnlyAvailableInCorrectEnv }

import { expect, sleep, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../retrievePageContext'

function testSettingOnlyAvailableInCorrectEnv() {
  test('Custom Setting Env - Client-only', async () => {
    // Avoid weird error:
    // ```console
    // proxy.goto: Navigation to "http://localhost:3000/config-meta/env/client" is interrupted by another navigation to "http://localhost:3000/"
    // ```
    await sleep(100)

    let json = await retrievePageContext('/config-meta/env/client', { clientSide: true })

    expect(json).to.deep.equal({
      settingServerOnly: 'undefined',
      settingClientOnly: { nested: 'clientOnly @ /env' },
      settingConfigOnly: 'undefined',
    })
  })

  test('Custom Setting Env - Server-only', async () => {
    let json = await retrievePageContext('/config-meta/env/server')

    expect(json).to.deep.equal({
      settingServerOnly: { nested: 'serverOnly @ /env' },
      settingClientOnly: 'undefined',
      settingConfigOnly: 'undefined',
    })
  })
}
