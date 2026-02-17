export { PricingTable }

import React from 'react'

const fontSizePrice = 30
const fontSizePrice2 = 25
/*
<div>{'=>'} Use Vike just like any other open source project</div>
*/

const styleTierDescription = { color: '#888', fontSize: '0.9em' } satisfies React.CSSProperties

function PricingTable() {
  return (
    <>
      <div style={{ display: 'flex', gap: 10 }}>
        <ColumnFree>Small team</ColumnFree>
        <Column>
          <TierName>Larger team</TierName>
          ≥3 <SoftwareDevelopers />
          <div style={{ display: 'flex', gap: 10 }}>
            <div>
              <b>
                Limited resources<NoteRef>3</NoteRef>
              </b>
              <Free />
              <Check>Full access</Check>
              <Check>Forever free</Check>
              <Check>
                <a href="">Apply</a> for free license key
              </Check>
            </div>
            <div>
              <b>
                Sufficient resources<NoteRef style={{ visibility: 'hidden' }}>2</NoteRef>
              </b>
              <div>
                <span style={{ color: 'blue', fontSize: fontSizePrice2 }}>$5k</span>
                <span style={{ color: '#777' }}> one time</span>
              </div>
              <Check>Full access</Check>
              <Check>
                Forever access<NoteRef>4</NoteRef>
              </Check>
            </div>
          </div>
        </Column>
      </div>
      <div style={{marginTop: 10}}>
        <Note ref={1}>Only regular committers: occasional committers and bots don't count.</Note>
        <Note ref={2}>
          License key isn't required: you use Vike just like any regular open source tool (zero encumbrance).
        </Note>
        <Note ref={3}>
          Organizations are considered to have limited resources if they employ fewer than 5 paid full-time employees (dev or non-dev combined).
        </Note>
      </div>
    </>
  )
}

function ColumnFree({ children }: { children: string }) {
  return (
    <Column>
      <TierName>{children}</TierName>
      ≤2 <SoftwareDevelopers />
      <div style={{ visibility: 'hidden' }}>Invisible filler</div>
      <div style={styleTierDescription}></div>
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
  return <sup {...{ style }}> ({children})</sup>
}
function Note({ children, ref }: { children: string; ref: number }) {
  return (
    <div style={{ color: '#666', fontSize: '0.94em' }}>
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
  return <Price color="#090">Free</Price>
}

function Price({ children, color }: { children: string; color: string }) {
  return <div style={{ fontSize: fontSizePrice, color }}>{children}</div>
}

function TierName({ children }: { children: string }) {
  return <div style={{ fontSize: 30 }}>{children}</div>
}

function Column({ children }: { children: React.ReactNode }) {
  return <div style={{ border: '1px solid #ddd', padding: 10, background: '#fcfcfc' }}>{children}</div>
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <GreenCheckmark /> {children}
    </div>
  )
}

function GreenCheckmark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="#0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
