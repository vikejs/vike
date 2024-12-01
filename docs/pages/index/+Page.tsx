export { Page }

import React, { useEffect, useRef } from 'react'
import { Hero } from './sections/Hero/Hero'
import { Sponsors } from './sections/Sponsors/Sponsors'
import { Flexible } from './sections/Flexible/Flexible'
import { Reliable } from './sections/Reliable/Reliable'
import { Features } from './sections/Features/Features'
import { Philosophy } from './sections/Philosophy/Philosophy'
import { CTA } from './sections/CTA/CTA'
import './page.css'

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
        <Sponsors />
      </Block>
      <CTA />
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
        marginTop: 'var(--block-margin)',
        ...style
      }}
    >
      {noGrid ? children : <Grid>{children}</Grid>}
    </div>
  )
}

export function Grid({
  children,
  style,
  className
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
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
