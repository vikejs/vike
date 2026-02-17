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
    <div style={{ display: 'flex', gap: 10 }}>
      <ColumnFree>Small team</ColumnFree>
      <Column>
        <TierName>Larger team</TierName>
        ≥3 Software Developers
        <div style={{ display: 'flex', gap: 10 }}>
          <div>
            <div>Limited resources</div>
            <Free />
          </div>
          <div>
            <div>Sufficient resources</div>
            <div>
              <span style={{ color: 'blue', fontSize: fontSizePrice2 }}>$5k</span>
              <span style={{ color: '#777' }}> one time</span>
            </div>
            <Check>Lifetime access</Check>
            <Check>Unlimited access</Check>
          </div>
        </div>
      </Column>
    </div>
  )
}

function ColumnFree({ children }: { children: string }) {
  return (
    <Column>
      <TierName>{children}</TierName>
      ≤2 Software Developers
      <div style={styleTierDescription}></div>
      <Free />
      <div>
        <Check>No license key</Check>
        <Check>Unlimited access</Check>
        <Check>Free forever</Check>
      </div>
    </Column>
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

function Check({ children }: { children: string }) {
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
