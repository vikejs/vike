export { Page }

import React from 'react'

function Page() {
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
        Thank you for your purchase!
      </h1>
      <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
        You will receive your Vike license key by email within a few minutes.
      </p>
      <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
        If you don't receive it within 10 minutes, please check your spam folder or{' '}
        <a href="mailto:license@vike.dev" style={{ color: '#2563eb' }}>
          contact us
        </a>
        .
      </p>
      <a href="/pricing" style={{ color: '#2563eb', fontSize: 15 }}>
        ← Back to pricing
      </a>
    </div>
  )
}
