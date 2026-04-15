export { Banner }
export { BannerCover }
export { BannerMinimal }
export { BannerSlides }
export { BannerVikings }

import React from 'react'
import vikeLogo from '../../assets/logo/vike-shadow.svg'
import { Hero } from '../index/sections/Intro/Hero'
import '../index/tailwind.css'
import './Banner.css'

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
            }}
          >
            <img
              src={vikeLogo}
              style={{
                height: 60 * logoScale,
                objectFit: 'contain',
                marginRight: 14,
                ...logoStyle,
              }}
            />
            <span
              className="logo-font"
              style={{
                fontSize: 40 * logoScale,
                letterSpacing: '-0.01em',
                fontWeight: 380,
                color: '#555',
                lineHeight: '1.2em',
                ...logoTextStyle,
              }}
            >
              {logoText}
            </span>
          </div>
        )}
        {logo !== true && (
          <div className="text-center flex flex-col items-center" style={{ gap: 28 }}>
            <Hero />
            <a className="btn btn-lg text-white border-0 btn-neutral" href="/new">
              Get Started
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
