export { Page }

import React, { useEffect, useRef } from 'react'
import { Hero } from './sections/Hero'
import { Sponsors } from './sections/Sponsors'
import { Flexible } from './sections/Flexible'
import { Reliable } from './sections/Reliable'
import { Features } from './sections/Features'
import { Philosophy } from './sections/Philosophy'

export const primaryColor = '#1810FF'

function Page() {
  return (
    <>
      <Block style={{ marginTop: 0 }}>
        <Hero />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0,
          backgroundColor: '#FAFAFA'
        }}
      >
        <Flexible />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0
        }}
      >
        <Reliable />
      </Block>
      <Block
        style={{
          backgroundColor: '#EEEEF2'
        }}
      >
        <Features />
      </Block>
      <Block
        style={{
          padding: 0
        }}
        noGrid
      >
        <Philosophy />
      </Block>
      <Block>
        <div style={{ height: 60 }} />
        <Sponsors />
        <div style={{ height: 50 }} />
      </Block>
    </>
  )
}

export function Block({
  children,
  style,
  noGrid
}: {
  children?: React.ReactNode
  style?: React.CSSProperties
  noGrid?: boolean
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        marginTop: 'var(--block-margin)',
        ...style
      }}
    >
      {noGrid ? children : <Grid>{children}</Grid>}
    </div>
  )
}

export function Grid({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: '100%',
        padding: '0 20px',
        ...style
      }}
    >
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>{children}</div>
    </div>
  )
}
