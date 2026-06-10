export { Page }

import React from 'react'
import { LocalPrice } from '@vikejs/license-components'
// Reuse the price + button chrome from the pricing page (the component sets no colors/fonts itself).
import '../../pricing/local-price.css'

// Muted text — matches the success page's tone.
const colorMuted = 'oklch(0.54 0 0)'

// Dedicated checkout page (`/license/buy`). Renders <LocalPrice> — the visitor's local price plus the
// "Pay by bank transfer" (recommended, lowest fees) / "Pay by card" buttons, each opening a Stripe
// Checkout Session via dash.vike.dev. Stripe localizes the actual currency at checkout (our custom
// amount for a Wise currency, else Adaptive Pricing). The mailto covers anything off the beaten path.
function Page() {
  return (
    <div style={{ maxWidth: 580, margin: 'auto', marginTop: 20, textAlign: 'center' }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Get your Vike license</h1>
      <p style={{ color: colorMuted, fontSize: '1.05em', lineHeight: 1.5, marginBottom: 24 }}>
        One-time payment for a lifetime license — valid forever, for an unlimited number of Vike apps.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LocalPrice className="pricing-local" priceClassName="pricing-local-price" buttonClassName="pricing-local-buy" />
      </div>

      <p style={{ color: colorMuted, fontSize: '0.95em', marginTop: 18 }}>
        Paying by bank is recommended — it keeps fees lowest. Card is available too.
      </p>
      <p style={{ color: colorMuted, fontSize: '0.9em', marginTop: 14 }}>
        Need another payment method (an invoice, a different currency)?{' '}
        <a href="mailto:support@vike.dev">Reach out</a>.
      </p>
    </div>
  )
}
