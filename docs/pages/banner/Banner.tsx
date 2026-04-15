export { Banner }
export { BannerCover }
export { BannerMinimal }
export { BannerSlides }
export { BannerVikings }

import React from 'react'
import vikeLogo from '../../assets/logo/vike-shadow.svg'
import '../index/tailwind.css'
import './Banner.css'
import GradientText from '../index/components/GradientText'
import { heroTaglineSecondary } from '../index/sections/Intro/Hero'

function Banner() {
  return <BannerCommon />
}
function BannerCover() {
  return <BannerCommon logo={false} />
}
function BannerMinimal() {
  return <BannerMinimalCommon style={{ background: 'white' }} />
}
function BannerMinimalBlack() {
  return <BannerMinimalCommon style={{ background: 'black' }} />
}
function BannerMinimalCommon({ style }: { style?: React.CSSProperties }) {
  return <BannerCommon logo={false} logoScale={1.1} style={style} />
}
function BannerSlides() {
  return <BannerCommon style={{ background: 'white' }} />
}
function BannerVikings() {
  return (
    <BannerCommon
      logo
      logoText="Vikings"
      logoScale={1.1}
      logoStyle={{
        //*
        display: 'none',
        //*/
        position: 'absolute',
        top: 40,
        right: 30,
        height: 80,
        margin: 0,
      }}
      logoTextStyle={{
        fontWeight: 496,
        marginLeft: 11,
        fontSize: '3.13em',
        letterSpacing: 0.5,
        background: '-webkit-linear-gradient(300deg, #973636 20%, #cb4545)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    />
  )
}

function BannerCommon({
  style,
  logo,
  logoText = 'Vike',
  logoScale = 1.3,
  logoStyle,
  logoTextStyle,
}: {
  style?: React.CSSProperties
  logo?: boolean
  logoText?: string
  logoScale?: number
  logoStyle?: React.CSSProperties
  logoTextStyle?: React.CSSProperties
}) {
  return (
    <div
      id="tailwind-portal"
      data-theme="vike"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f5f5f5',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '0 24px',
          // Don't center completely
          marginTop: -24,
        }}
      >
        {logo !== false && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: -10,
              marginBottom: -10,
            }}
          >
            <img
              src={vikeLogo}
              style={{
                height: 60 * logoScale,
                objectFit: 'contain',
                ...logoStyle,
              }}
            />
            <span
              className="logo-font"
              style={{
                fontSize: 40 * logoScale,
                fontWeight: 440,
                color: '#666',
                lineHeight: '1.2em',
                marginLeft: -1,
                ...logoTextStyle,
              }}
            >
              {logoText}
            </span>
          </div>
        )}
        {logo !== true && (
          <div className="text-center flex flex-col items-center" style={{ gap: 13, maxWidth: 750 }}>
            <Hero />
          </div>
        )}
      </div>
    </div>
  )
}

const Hero = () => (
  <>
    <h1 className="text-6xl! font-bold mx-auto">
      Framework for <br />
      <GradientText color="blue">Stability</GradientText> and <GradientText color="green">Freedom</GradientText>
    </h1>
    <p className="text-base md:text-2xl text-grey text-center mx-auto mb-6 mt-4">{heroTaglineSecondary}</p>
  </>
)
