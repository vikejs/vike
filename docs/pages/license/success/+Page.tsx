export { Page }

import { Link } from '@brillout/docpress'
import React from 'react'

function Page() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Thank you for your purchase</h1>
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
            Final step: install the license key, see <Link href="/license#installation" />.
          </li>
        </ol>
      </div>
    </>
  )
}
