export { Page }

import React from 'react'
import { Hero } from './sections/hero/Hero'
import { Sponsors } from './sections/sponsors/Sponsors'
import { Flexible } from './sections/flexible/Flexible'
import { Reliable } from './sections/reliable/Reliable'
import { Features } from './sections/features/Features'
import { Philosophy } from './sections/philosophy/Philosophy'
import { End } from './sections/end/End'
import { Grid } from './components/Grid'
import './Page.css'

function Page() {
  return (
    <div id="landing-page">
      <Block style={{ marginTop: 0 }}>
        <Hero />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0,
          backgroundColor: '#f0f0f0',
        }}
      >
        <Flexible />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Reliable />
      </Block>
      <Block
        style={{
          backgroundColor: '#EEEEF2',
        }}
      >
        <Features />
      </Block>
      <Block
        style={{
          padding: 0,
        }}
        noGrid
      >
        <Philosophy />
      </Block>
      <Block>
        <Sponsors />
      </Block>
      <Block
        style={{
          padding: 0,
          backgroundColor: '#fbfbfb',
        }}
      >
        <End />
      </Block>
    </div>
  )
}

function Block({
  children,
  style,
  noGrid,
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
        ...style,
      }}
    >
      {noGrid ? children : <Grid>{children}</Grid>}
    </div>
  )
}
