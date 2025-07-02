export { CustomIntegrationWarning }

import { Link, Advanced } from '@brillout/docpress'
import React from 'react'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components'

function CustomIntegrationWarning({ uiFramework }: { uiFramework?: 'react' | 'vue' | 'solid' }) {
  const list: UiFrameworkExtensionList | undefined = uiFramework && [`vike-${uiFramework}`]
  const uiFrameworkName = !uiFramework ? 'React/Vue/Solid/...' : uiFramework[0].toUpperCase() + uiFramework.slice(1)
  const uiFrameworkExtension = !list ? (
    <UiFrameworkExtension succinct />
  ) : (
    <UiFrameworkExtension name noLink list={list} />
  )
  return (
    <Advanced>
      Custom integrations can be complex and we generally recommend using {uiFrameworkExtension} instead.
      <br />
      <br />
      <span style={{ fontFamily: 'emoji' }}>👉</span> That said, a custom integration can make sense in following
      scenarios:
      <ul>
        <li>
          You are building an app with a simple architecture.
          <blockquote>
            <p>
              For example, <code>https://vike.dev</code> has a simple architecture and uses a custom integration.
            </p>
            <p>
              You can read the source code of {uiFrameworkExtension} (it's small!) and check whether you'll need most of
              the code or not — if you do then it most likely makes sense to use {uiFrameworkExtension}.
            </p>
          </blockquote>
        </li>
        <li>
          You have already tried {uiFrameworkExtension} but ran into a fundamental blocker with it.
          <blockquote>
            <p>We recommend starting a discussion with a {uiFrameworkExtension} maintainer.</p>
          </blockquote>
        </li>
        <li>You are curious and want to deepen your {uiFrameworkName} knowledge.</li>
      </ul>
      <p>
        See also: <Link href="/extension-vs-custom" />.
      </p>
    </Advanced>
  )
}
