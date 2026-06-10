export { Page }

import { Link } from '@brillout/docpress'
import React from 'react'

const colorBorder = '#e2e8f0'
// Muted text, based on the landing-page hero tagline grey (`text-grey` → `--color-grey`), darkened slightly (0.5553 → 0.54) to meet WCAG AA contrast at this page's smaller text sizes
const colorMuted = 'oklch(0.54 0 0)'
// docpress's site-wide text color (the muted/border colors below have no docs-wide var)
const colorHeading = 'var(--color-text)'

function Page() {
  // The buyer's chosen method, echoed by the dashboard into `?method=` on success_url. A bank payment
  // (transfer or debit) is asynchronous — the sign-in email only goes out once it settles — so its copy
  // differs. Read client-side (the param isn't known at SSR). Bank is the preferred path we steer to,
  // so it's the default; only an explicit `?method=card` shows the card wording.
  const [bankTransfer, setBankTransfer] = React.useState(true)
  React.useEffect(() => {
    setBankTransfer(new URLSearchParams(window.location.search).get('method') !== 'card')
  }, [])

  return (
    <div style={{ maxWidth: 580, margin: 'auto' }}>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div role="img" aria-label="Celebration" style={{ fontSize: 56, marginBottom: 12 }}>
          🎉
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: colorHeading, marginBottom: 12 }}>
          {bankTransfer ? 'Thank you for your purchase' : "You're all set"}
        </h1>
        <p style={{ color: colorMuted, fontSize: '1.05em', lineHeight: 1.5, margin: 0 }}>
          {bankTransfer
            ? 'Your bank payment is being processed — see the next steps below.'
            : 'You can now use Vike fully unlocked, forever.'}
        </p>
      </div>

      <div
        style={{
          marginTop: 28,
          padding: '20px 28px',
          background: '#fefefe',
          border: `1px solid ${colorBorder}`,
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <h2 style={{ fontSize: '1em', fontWeight: 600, color: colorHeading, margin: '0 0 6px' }}>Next steps</h2>
        <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
          {bankTransfer ? (
            <li>
              Once your bank payment settles (usually 1–3 business days), we'll email a sign-in link to the{' '}
              <a href="https://dash.vike.dev">Vike dashboard</a>. If you chose bank transfer, complete it first
              using the instructions from Stripe.
            </li>
          ) : (
            <li>
              Check your inbox — we sent an email with a sign-in link to the{' '}
              <a href="https://dash.vike.dev">Vike dashboard</a>
            </li>
          )}
          <li>Use the dashboard to generate a license key for your domains</li>
          <li>
            <Link href="/license#install">
              Add the license key to <code>+config.js</code>
            </Link>
          </li>
        </ol>
      </div>

      <p style={{ textAlign: 'center', color: colorMuted, fontSize: '0.9em', marginTop: 16 }}>
        Having issues? <a href="mailto:support@vike.dev">Contact us</a>.
      </p>
    </div>
  )
}
