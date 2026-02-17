export { PricingTable }

import React from 'react'
import './PricingTable.css'

const fontSizePrice = 30
const noteColor = '#6b7280'
/*
<div>{'=>'} Use Vike just like any other open source project</div>
*/

const styleTierDescription = { color: '#6b7280', fontSize: '0.9em' } satisfies React.CSSProperties

function PricingTable() {
  return (
    <div id="pricing-table">
      <ExtraWidth width={100}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Column>
              <TierName>Small team</TierName>
              ≤2 <SoftwareDevelopers />
              <div style={styleTierDescription}></div>
              <SubHeading style={{ visibility: 'hidden' }}>Invisible filler</SubHeading>
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
              <div style={{ display: 'flex', gap: 35 }}>
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
                  <SubHeading>
                    Sufficient resources<NoteRef style={{ visibility: 'hidden' }}>2</NoteRef>
                  </SubHeading>
                  <Price color="#2563eb" suffix=" one time">
                    $5k
                  </Price>
                  <Check>Full access</Check>
                  <Check>
                    Forever access<NoteRef>4</NoteRef>
                  </Check>
                  <Check>
                    Free trial: 6 months, <a href="">extendable</a>
                  </Check>
                </div>
              </div>
            </Column>
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Note ref={1}>Only regular committers: occasional committers and bots don't count.</Note>
            <Note ref={2}>
              License key isn't required: you use Vike just like any regular open source tool (zero encumbrance).
            </Note>
            <Note ref={3}>
              Organizations with only a <a href="">few full-time employees</a> are considered resource-limited.
            </Note>
            <Note ref={4}>
              One-time payment for a lifetime license key: valid forever, including all future Vike updates.
            </Note>
          </div>
        </div>
      </ExtraWidth>
    </div>
  )
}

function SubHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginTop: 20, ...style }}>
      <b style={{ whiteSpace: 'nowrap' }}>{children}</b>
    </div>
  )
}

function NoteRef({ children, style }: { children: string; style?: React.CSSProperties }) {
  return <sup style={{ color: noteColor, ...style }}> ({children})</sup>
}
function Note({ children, ref }: { children: React.ReactNode; ref: number }) {
  return (
    <div style={{ color: noteColor, fontSize: '0.9em', lineHeight: 1.2 }}>
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
  return <Price color="#059669">Free</Price>
}

function Price({ children, color, suffix }: { children: string; color: string; suffix?: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8, marginBottom: 12 }}>
      <span style={{ fontSize: fontSizePrice, color, fontWeight: 700 }}>{children}</span>
      {suffix && <span style={{ fontSize: 16, color: '#6b7280', fontWeight: 400 }}>{suffix}</span>}
    </div>
  )
}

function TierName({ children }: { children: string }) {
  return <h2 style={{ fontSize: 25, fontWeight: 600, marginBottom: 2, color: '#111827', marginTop: 0 }}>{children}</h2>
}

function Column({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        padding: 25,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <GreenCheckmark /> <span>{children}</span>
    </div>
  )
}

function GreenCheckmark({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExtraWidth({ children, width }: { children: React.ReactNode; width: number }) {
  return <div style={{ marginLeft: -width / 2, marginRight: -width / 2 }}>{children}</div>
}
