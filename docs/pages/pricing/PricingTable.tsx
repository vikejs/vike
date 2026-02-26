export { PricingTable }

import React from 'react'
import './PricingTable.css'
import { Link } from '@brillout/docpress'

const noteColor = '#64748b'

function PricingTable() {
  return (
    <div id="pricing-table">
      <ExtraWidth width={100}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Column>
                <TierName>Small team</TierName>
                ≤2 <SoftwareDevelopers />
                <SubHeading id="pricing-table_filler" style={{ visibility: 'hidden' }}>
                  Invisible filler<NoteRef>3</NoteRef>
                </SubHeading>
                <Free />
                <div>
                  <Check>Full access</Check>
                  <Check>Forever free</Check>
                  <Check>
                    No license key<NoteRef>2</NoteRef>
                  </Check>
                </div>
              </Column>
              <Column>
                <TierName>Larger team</TierName>
                ≥3 <SoftwareDevelopers />
                <div style={{ display: 'flex', columnGap: 40, rowGap: 15, flexWrap: 'wrap' }}>
                  <div className="pricing-section-limited">
                    <SubHeading>
                      Limited resources<NoteRef>3</NoteRef>
                    </SubHeading>
                    <Free />
                    <Check>Full access</Check>
                    <Check>Forever free</Check>
                    <Check>
                      <Link href="/gift">Apply</Link> for free license key
                    </Check>
                  </div>
                  <SectionDivider />
                  <div className="pricing-section-sufficient">
                    <SubHeading>Sufficient resources</SubHeading>
                    <Price color="#2563eb" suffix=" one time">
                      $5k
                    </Price>
                    <Check>Full access</Check>
                    <Check>
                      Forever access<NoteRef>4</NoteRef>
                    </Check>
                    <Check>
                      Free trial: 6 months + <Link href="/gift">extendable</Link>
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
                License key isn't required: you use Vike just like any regular open source tool (zero encumbrance).
              </Note>
              <Note ref={3}>
                E.g. organizations with <Link href="/gift#who-s-eligible">few employees</Link> are considered
                resource-limited.
              </Note>
              <Note ref={4}>
                One-time payment for a lifetime license key: valid forever, including all future Vike updates.
              </Note>
            </div>
          </div>
        </div>
      </ExtraWidth>
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="pricing-section-divider">
      <span className="pricing-section-divider-or">or</span>
    </div>
  )
}

function SubHeading({ children, id, style }: { children: React.ReactNode; style?: React.CSSProperties; id?: string }) {
  return (
    <div id={id} style={{ marginTop: 23, ...style }}>
      <b>{children}</b>
    </div>
  )
}

function NoteRef({ children, style }: { children: string; style?: React.CSSProperties }) {
  return <sup style={{ color: noteColor, ...style }}> ({children})</sup>
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

function Price({ children, color, suffix }: { children: string; color: string; suffix?: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8, marginBottom: 13 }}>
      <span style={{ fontSize: 36, color, fontWeight: 700 }}>{children}</span>
      {suffix && <span style={{ color: '#6b7280' }}>{suffix}</span>}
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExtraWidth({ children, width }: { children: React.ReactNode; width: number }) {
  return (
    <div id="pricing-table_extra-width" style={{ marginLeft: -width / 2, marginRight: -width / 2 }}>
      {children}
    </div>
  )
}
