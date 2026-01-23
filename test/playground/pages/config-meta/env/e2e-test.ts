export { testSettingOnlyAvailableInCorrectEnv }

import { expect, sleep, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../retrievePageContext'

function testSettingOnlyAvailableInCorrectEnv() {
  test('Custom Setting Env - Client-only', async () => {
    // Avoid weird error:
    // ```shell
    // proxy.goto: Navigation to "http://localhost:3000/config-meta/env/client" is interrupted by another navigation to "http://localhost:3000/"
    // ```
    await sleep(100)

    expect(await retrievePageContext('/config-meta/env/client', { clientSide: true })).to.deep.equal({
      settingServerOnly: 'undefined',
      settingClientOnly: { nested: 'clientOnly @ /env' },
      settingConfigOnly: 'undefined',
    })
  })

  test('Custom Setting Env - Server-only', async () => {
    expect(await retrievePageContext('/config-meta/env/server')).to.deep.equal({
      settingServerOnly: { nested: 'serverOnly @ /env' },
      settingClientOnly: 'undefined',
      settingConfigOnly: 'undefined',
    })
  })
}
