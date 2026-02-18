export { PricingTable }

import React from 'react'
import './PricingTable.css'

const noteColor = '#64748b'

function PricingTable() {
  return (
    <div id="pricing-table">
      <ExtraWidth width={100}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <Column>
                <TierName>Small team</TierName>
                ≤2 <SoftwareDevelopers />
                <SubHeading style={{ visibility: 'hidden' }}>
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
                <div style={{ display: 'flex', gap: 40 }}>
                  <div>
                    <SubHeading>
                      Limited resources<NoteRef>3</NoteRef>
                    </SubHeading>
                    <Free />
                    <Check>Full access</Check>
                    <Check>Forever free</Check>
                    <Check>
                      <a href="">Apply</a> for free license key
                    </Check>
                  </div>
                  <div>
                    <SubHeading>Sufficient resources</SubHeading>
                    <Price color="#2563eb" suffix=" one time">
                      $5k
                    </Price>
                    <Check>Full access</Check>
                    <Check icon="gift">
                      Forever access<NoteRef>4</NoteRef>
                    </Check>
                    <Check icon="gift">
                      Free trial: 6 months + <a href="">extendable</a>
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
                Organizations with <a href="">few employees</a> are considered resource-limited.
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

function SubHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginTop: 23, ...style }}>
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

function Check({ children, icon }: { children: React.ReactNode; icon?: 'gift' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
      {icon === 'gift' ? <GiftIcon /> : <GreenCheckmark />} <span>{children}</span>
    </div>
  )
}

function GiftIcon() {
  const size = 18
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <path fill="#DD2E44" d="M33 15c0-4-4-7-7-7-3 0-6 2-6 5 0 0 0-3-6-5-6-2-8 3-8 7H0v3h36v-3z" />
      <path fill="#A0041E" d="M0 15v3h36v-3H0z" />
      <path fill="#DD2E44" d="M0 18v15c0 1.104.896 2 2 2h14V18H0z" />
      <path fill="#DD2E44" d="M20 18v17h14c1.104 0 2-.896 2-2V18H20z" />
      <path fill="#A0041E" d="M16 35h4V18h-4z" />
      <circle fill="#FFCC4D" cx="14" cy="9" r="4" />
      <circle fill="#FFCC4D" cx="22" cy="9" r="4" />
      <path
        fill="#FFAC33"
        d="M18 11c-.772 0-1.467-.298-2-.78-.533.482-1.228.78-2 .78 1.105 0 2 .895 2 2 0-1.105.895-2 2-2z"
      />
      <path
        fill="#77B255"
        d="M15.999 13a2 2 0 0 1-2-2c0 .552-.448 1-1 1-.256 0-.487-.098-.667-.257C12.137 12.468 12 13.221 12 14c0 2.209 1.791 4 4 4v-5z"
      />
      <path
        fill="#77B255"
        d="M20 13a2 2 0 0 0 2-2c0 .552.448 1 1 1 .256 0 .487-.098.667-.257.195.725.333 1.478.333 2.257 0 2.209-1.791 4-4 4v-5z"
      />
    </svg>
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
  return <div style={{ marginLeft: -width / 2, marginRight: -width / 2 }}>{children}</div>
}
