export { PricingTable }

import React from 'react'

const fontSizePrice = 30
const noteColor = '#6b7280'
/*
<div>{'=>'} Use Vike just like any other open source project</div>
*/

const styleTierDescription = { color: '#6b7280', fontSize: '0.9em' } satisfies React.CSSProperties

function PricingTable() {
  return (
    <>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <ColumnFree>Small team</ColumnFree>
        <Column>
          <TierName>Larger team</TierName>
          ≥3 <SoftwareDevelopers />
          <div style={{ display: 'flex', gap: 15 }}>
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
              <div
                style={{ fontSize: fontSizePrice, color: '#2563eb', fontWeight: 700, marginTop: 8, marginBottom: 12 }}
              >
                <span style={{ fontSize: fontSizePrice }}>$5k</span>
                <span style={{ fontSize: 16, color: '#6b7280', fontWeight: 400 }}> one time</span>
              </div>
              <Check>Full access</Check>
              <Check>
                Forever access<NoteRef>4</NoteRef>
              </Check>
              <Check>
                Six months free trial, <a href="">extendable</a>
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
    </>
  )
}

function SubHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginTop: 20, ...style }}>
      <b style={{ whiteSpace: 'nowrap' }}>{children}</b>
    </div>
  )
}

function ColumnFree({ children }: { children: string }) {
  return (
    <Column style={{ flex: 0.5 }}>
      <TierName>{children}</TierName>
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

function Price({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ fontSize: fontSizePrice, color, fontWeight: 700, marginTop: 8, marginBottom: 12 }}>{children}</div>
  )
}

function TierName({ children }: { children: string }) {
  return <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: '#111827' }}>{children}</div>
}

function Column({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        padding: 24,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        flex: '1',
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
