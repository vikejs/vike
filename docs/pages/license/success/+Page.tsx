export { Page }

import { Link } from '@brillout/docpress'
import React from 'react'

function Page() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Purchase successful</h1>
      </div>
      <div style={{ maxWidth: 550, margin: 'auto' }}>
        Next steps:
        <ol>
          <li>
            You'll receive an email with a sign-in link to the <a href="https://dash.vike.dev">Vike dashboard</a>.
            <blockquote>
              <p>
                If you don't receive any email, check your spam folder or <a href="mailto:support@vike.dev">contact us</a>.
              </p>
            </blockquote>
          </li>
          <li>
    Use the Vike dashboard to generate a license key for your domains.
          </li>
          <li>
            <Link href="/license#install">Add the license key to <code>+config.js</code></Link>.
          </li>
        </ol>
        Vike is now fully unlocked.
      </div>
    </>
  )
}
