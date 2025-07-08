export { Banner }
export { BannerVikings }

import React from 'react'
import { HeroTagline } from '../index/sections/hero/Hero'
import vikeLogo from '../../assets/logo/vike.svg'
import './Banner.css'

function BannerVikings() {
  return (
    <BannerCommon
      logoOnly
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

function Banner() {
  return <BannerCommon />
}

function BannerCommon({
  logoOnly,
  logoText = 'Vike',
  logoScale = 1.3,
  logoStyle,
  logoTextStyle,
}: {
  logoOnly?: boolean
  logoText?: string
  logoScale?: number
  logoStyle?: React.CSSProperties
  logoTextStyle?: React.CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f0f0f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // Don't center completely
          marginTop: -8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: -7,
            marginLeft: -25,
          }}
        >
          <img
            src={vikeLogo}
            style={{
              height: 60 * logoScale,
              objectFit: 'contain',
              marginTop: -8,
              marginRight: 14,
              ...logoStyle,
            }}
          />
          <span
            className="logo-font"
            style={{
              fontSize: 45.6 * logoScale,
              fontWeight: 440,
              fontStyle: 'italic',
              color: '#707070',
              lineHeight: '1.2em',
              ...logoTextStyle,
            }}
          >
            {logoText}
          </span>
        </div>
        {!logoOnly && (
          <HeroTagline
            style={{ marginTop: -0 }}
            taglineStyle={{ fontSize: 50 * logoScale, marginBottom: 25 }}
            taglineSecondaryStyle={{
              marginTop: 19,
              fontSize: 28 * logoScale,
              maxWidth: 600 * logoScale,
              lineHeight: 1.3,
            }}
          />
        )}
      </div>
    </div>
  )
}
