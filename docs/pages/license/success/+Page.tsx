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
            You'll receive your license key by email.
            <blockquote>
              <p>
                If you don't, check your spam folder or <a href="mailto:support@vike.dev">contact us</a>.
              </p>
            </blockquote>
          </li>
          <li>
            <Link href="/license#install">Install your license key</Link>.
          </li>
        </ol>
        That's it — you can now use Vike, forever without restrictions.
        <blockquote>
          <p>
            To update your list of domain names, see <Link href="/license#update-domain-names" />.
          </p>
        </blockquote>
      </div>
    </>
  )
}
