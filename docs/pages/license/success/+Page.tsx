export { Page }

import { Link } from '@brillout/docpress'
import React from 'react'

function Page() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Purchase successful</h1>
      </div>
      <div style={{ maxWidth: 550, margin: 'auto' }}>
        Next steps:
        <ol>
          <li>
            Check your inbox for a sign-in link to your dashboard at <a href="https://dash.vike.dev">dash.vike.dev</a>.
            <blockquote>
              <p>
                If you don't receive it, check your spam folder or <a href="mailto:support@vike.dev">contact us</a>.
              </p>
            </blockquote>
          </li>
          <li>
            From the dashboard, generate forever-valid license keys for your domains and{' '}
            <Link href="/license#install">
              install them in your <code>+config.js</code>
            </Link>
            .
          </li>
        </ol>
        That's it — you can now use Vike, forever without restrictions.
        <blockquote>
          <p>
            To change which domains your keys cover, sign back in at <a href="https://dash.vike.dev">dash.vike.dev</a>{' '}
            and re-run the generator. Your sign-in link from the welcome email keeps working — bookmark it for later.
          </p>
        </blockquote>
      </div>
    </>
  )
}
