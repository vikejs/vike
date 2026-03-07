export { PricingTable }

import React from 'react'
import './PricingTable.css'
import { Link } from '@brillout/docpress'
import { ExtraWidth } from '../../components/ExtraWidth'

const noteColor = '#64748b'

function PricingTable() {
  return (
    <ExtraWidth>
      <div id="pricing-table">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Column>
              <TierName>Small team</TierName>
              ≤2 <SoftwareDevelopers />
              <SubHeading className="pricing-table_filler" style={{ visibility: 'hidden' }}>
                Invisible filler<NoteRef>2</NoteRef>
              </SubHeading>
              <Free />
              <div>
                <Check>Full access</Check>
                <Check>Forever free</Check>
                <Check>
                  No license key<NoteRef>3</NoteRef>
                </Check>
              </div>
            </Column>
            <Column>
              <TierName>Larger team</TierName>
              ≥3 <SoftwareDevelopers />
              <div className="pricing-inner-columns" style={{ columnGap: 40, rowGap: 15, flexWrap: 'wrap' }}>
                <div className="pricing-section pricing-section-limited">
                  <SubHeading>
                    Low financial resources<NoteRef>2</NoteRef>
                  </SubHeading>
                  <Free />
                  <Check>Full access</Check>
                  <Check>Forever free</Check>
                  <Check>
                    <Link href="/free">Apply</Link> for free license key
                  </Check>
                </div>
                <SectionDivider />
                <div className="pricing-section pricing-section-sufficient">
                  <SubHeading>
                    Enough financial resources<NoteRef>2</NoteRef>
                  </SubHeading>
                  <Price color="#2563eb" suffix=" one time" action={<BuyButton />}>
                    $5k
                  </Price>
                  <Check>Full access</Check>
                  <Check>
                    Forever access<NoteRef>4</NoteRef>
                  </Check>
                  <Check>
                    Free trial: 6 months + <Link href="/free">extendable</Link>
                  </Check>
                </div>
              </div>
            </Column>
          </div>
          <div style={{ marginLeft: 10, marginTop: 20 }}>
            <Note ref={1}>
              Only developers who regularly contribute code: occasional contributors and bots don't count.
            </Note>
            <Note ref={2}>
              Small organizations with few employees <Link href="/free#who-s-eligible">are eligible</Link> to use Vike
              for free.
            </Note>
            <Note ref={3}>
              License key isn't required: you use Vike just like any regular open source tool (zero encumbrance).
            </Note>
            <Note ref={4}>
              One-time payment for a lifetime license: valid forever, including all future Vike updates.
            </Note>
          </div>
        </div>
      </div>
    </ExtraWidth>
  )
}

function SectionDivider() {
  return (
    <div className="pricing-section-divider">
      <span className="pricing-section-divider-or">or</span>
    </div>
  )
}

function SubHeading({
  children,
  className,
  style,
}: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <h3 className={className} style={{ fontWeight: 400, ...style }}>
      <b>{children}</b>
    </h3>
  )
}

function NoteRef({ children, style }: { children: string; style?: React.CSSProperties }) {
  return <sup style={{ color: noteColor, ...style }}>&nbsp;({children})</sup>
}
function Note({ children, ref }: { children: React.ReactNode; ref: number }) {
  return (
    <div style={{ color: noteColor, fontSize: '0.94em', lineHeight: 1.5 }}>
      ({ref}) {children}
    </div>
  )
}

function SoftwareDevelopers() {
  return (
    <>
      Software Developers<NoteRef>1</NoteRef>
    </>
  )
}

function Free() {
  return <Price color="#10b981">Free</Price>
}

function Price({
  children,
  color,
  suffix,
  action,
}: { children: string; color: string; suffix?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8, marginBottom: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 36, color, fontWeight: 700 }}>{children}</span>
      {suffix && <span style={{ color: '#94a3b8', fontSize: 13 }}>{suffix}</span>}
      {suffix && action && <span style={{ color: '#cbd5e1', fontSize: 13 }}>·</span>}
      {action}
    </div>
  )
}

function TierName({ children }: { children: string }) {
  return <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: '#0f172a', marginTop: 0 }}>{children}</h2>
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        padding: 28,
        background: '#fefefe',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {children}
    </div>
  )
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
      <GreenCheckmark /> <span>{children}</span>
    </div>
  )
}

function GreenCheckmark() {
  const size = 18
  return (
    <svg
      style={{ width: size, height: size, flexShrink: 0 }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BuyButton() {
  return (
    <a
      href="https://buy.stripe.com/REPLACE_WITH_PAYMENT_LINK_ID"
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        color: '#2563eb',
        borderRadius: 20,
        fontWeight: 600,
        fontSize: 13,
        textDecoration: 'none',
        border: '1px solid #93c5fd',
      }}
    >
      Buy
    </a>
  )
}
