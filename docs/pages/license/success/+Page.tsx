export { Page }

import { Link } from '@brillout/docpress'
import React from 'react'

const colorNote = '#64748b'
const colorBorder = '#e2e8f0'
const colorHeading = '#0f172a'

function Page() {
  return (
    <div style={{ maxWidth: 560, margin: 'auto' }}>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: colorHeading, marginBottom: 12 }}>
          Thank you for supporting Vike
        </h1>
        <p style={{ color: colorNote, fontSize: '1.05em', lineHeight: 1.5, margin: 0 }}>
          Your license directly funds Vike's development. Your apps are now <b>fully unlocked</b>, forever. 🔓
        </p>
      </div>

      <a
        href="https://dash.vike.dev"
        style={{
          display: 'block',
          textAlign: 'center',
          maxWidth: 320,
          margin: '28px auto 0',
          padding: '12px 24px',
          // Matches the pricing page's button styling.
          background: 'linear-gradient(135deg, #f8f9fb 0%, #dbeafe 100%)',
          color: '#4167bb',
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 16,
          textDecoration: 'none',
          // https://caniuse.com/css-rrggbbaa
          border: '1px solid #93c5fd4a',
        }}
      >
        Open the Vike dashboard →
      </a>

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
        <div style={{ fontWeight: 600, color: colorHeading, marginBottom: 6 }}>Next steps</div>
        <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
          <li>
            Check your inbox — we just sent a sign-in link to the <a href="https://dash.vike.dev">Vike dashboard</a>.
          </li>
          <li>Use the dashboard to generate a license key for your domains.</li>
          <li>
            <Link href="/license#install">
              Add the license key to <code>+config.js</code>
            </Link>
            .
          </li>
        </ol>
      </div>

      <p style={{ textAlign: 'center', color: colorNote, fontSize: '0.9em', marginTop: 16 }}>
        Email didn't arrive? <a href="mailto:support@vike.dev">Contact us</a> and we'll help.
      </p>
    </div>
  )
}
