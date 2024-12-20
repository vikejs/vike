export { Page }

import React from 'react'
import { Hero, heroBgColor } from './sections/Hero/Hero'
import { Sponsors } from './sections/Sponsors/Sponsors'
import { Flexible } from './sections/Flexible/Flexible'
import { Reliable } from './sections/Reliable/Reliable'
import { Features } from './sections/Features/Features'
import { Philosophy } from './sections/Philosophy/Philosophy'
import { CTA } from './sections/CTA/CTA'
import { Grid } from './Grid'
import './page.css'
import { useHeadingUnderlineAnimation } from './useHeadingUnderlineAnimation'

function Page() {
  useHeadingUnderlineAnimation()
  return (
    <div id="landing-page">
      <Block
        style={{
          marginTop: 0,
          backgroundColor: heroBgColor
        }}
      >
        <Hero />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0
        }}
      >
        <Flexible />
      </Block>
      <Block
        noGrid
        style={{
          padding: 0,
          backgroundColor: '#FAFAFA'
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
      <Block
        style={{
          padding: 0,
          backgroundColor: '#fbfbfb'
        }}
      >
        <CTA />
      </Block>
    </div>
  )
}

function Block({
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
