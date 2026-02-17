export { PricingTable }

import React from 'react'

const fontSizePrice = 20

function PricingTable() {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <ColumnFree>Personal</ColumnFree>
      <ColumnFree>Non-profit</ColumnFree>
      <Column>
        <TierName>Company</TierName>
        <div>
          <span style={{ color: 'blue', fontSize: fontSizePrice }}>$5k</span>
          <span style={{ color: '#777' }}> one time</span>
        </div>
      </Column>
    </div>
  )
}

function ColumnFree({ children }: { children: string }) {
  return (
    <Column>
      <TierName>{children}</TierName>
      <Price color="#090">Free</Price>
      <div>
        <div>
          <GreenCheckmark /> No license key
        </div>
        <div>
          <GreenCheckmark /> Unlimited access
        </div>
        <div>
          <GreenCheckmark /> Forever
        </div>
        <div>{'=>'} Use Vike just like any other open source project</div>
      </div>
    </Column>
  )
}

function Price({ children, color }: { children: string; color: string }) {
  return <div style={{ fontSize: 20, color }}>{children}</div>
}

function TierName({ children }: { children: string }) {
  return <div style={{ fontSize: 30 }}>{children}</div>
}

function Column({ children }: { children: any }) {
  return <div style={{ border: '1px solid #ddd', padding: 10, background: '#fcfcfc' }}>{children}</div>
}

function GreenCheckmark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="#0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
