export { Hero }

import React from 'react'
import { primaryColor } from '../../primaryColor'
import { Button } from '../../components/Button/Button'
import './Hero.css'
import { linkGetStarted } from '../../links'
import { Link } from '@brillout/docpress'

function Hero() {
  return (
    <div
      id="hero-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 90,
        marginBottom: 110
      }}
    >
      <TalkLink />
      <Taglines />
      <GetStartedBtn />
    </div>
  )
}

function Taglines() {
  return (
    <div
      id="hero-taglines"
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        marginBottom: 46,
        marginTop: 16
      }}
    >
      <div
        className="landingpage-hero-headline"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h1
          style={{
            color: '#000000',
            textAlign: 'center',
            width: '100%',
            marginBottom: 0,
            fontWeight: 500,
            lineHeight: 1.1
          }}
        >
          <div id="tagline-main">
            The Framework{' '}
            <span
              style={{
                fontWeight: 600,
                color: '#42d392',
                // Copied from https://vuejs.org/
                background: '-webkit-linear-gradient(315deg, #42d392 25%, #647eff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              You
            </span>{' '}
            Control
          </div>
          <div
            id="tagline-secondary"
            style={{
              color: '#00000070',
              textAlign: 'center',
              width: '100%',
              marginTop: 10,
              lineHeight: 1.35,
              fontWeight: 400
            }}
          >
            <SpanAvoidBreakIfPossible>Next.js & Nuxt alternative for unprecedented</SpanAvoidBreakIfPossible>{' '}
            <SpanAvoidBreakIfPossible>flexibility, dependability, and control.</SpanAvoidBreakIfPossible>
          </div>
        </h1>
      </div>
    </div>
  )
}

function TalkLink() {
  return (
    <a
      href="https://www.youtube.com/watch?v=jzjtDC31ZnI&t=13s"
      target="_blank"
      style={{
        border: `1px solid ${primaryColor}30`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '36px',
        color: primaryColor,
        fontSize: '16px',
        fontWeight: 'medium',
        backgroundColor: `${primaryColor}10`,
        paddingRight: '16px',
        paddingLeft: '8px',
        borderRadius: '18px',
        cursor: 'pointer'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_321_3042)">
          <path
            d="M12.4604 0.719818C15.6563 0.719818 18.7213 1.98939 20.9812 4.24925C23.241 6.5091 24.5106 9.57412 24.5106 12.77C24.5106 15.966 23.241 19.031 20.9812 21.2908C18.7213 23.5507 15.6563 24.8203 12.4604 24.8203C9.26446 24.8203 6.19944 23.5507 3.93958 21.2908C1.67973 19.031 0.410156 15.966 0.410156 12.77C0.410156 9.57412 1.67973 6.5091 3.93958 4.24925C6.19944 1.98939 9.26446 0.719818 12.4604 0.719818ZM2.66957 12.77C2.66957 15.3667 3.7011 17.857 5.53723 19.6932C7.37336 21.5293 9.86369 22.5608 12.4604 22.5608C15.0571 22.5608 17.5474 21.5293 19.3835 19.6932C21.2197 17.857 22.2512 15.3667 22.2512 12.77C22.2512 10.1734 21.2197 7.68303 19.3835 5.84689C17.5474 4.01076 15.0571 2.97923 12.4604 2.97923C9.86369 2.97923 7.37336 4.01076 5.53723 5.84689C3.7011 7.68303 2.66957 10.1734 2.66957 12.77ZM10.0187 8.59313L16.4415 12.4477C16.497 12.4812 16.5429 12.5285 16.5747 12.585C16.6066 12.6415 16.6234 12.7052 16.6234 12.77C16.6234 12.8349 16.6066 12.8986 16.5747 12.9551C16.5429 13.0116 16.497 13.0589 16.4415 13.0924L10.0187 16.9469C9.96159 16.9813 9.89636 17 9.82969 17.0009C9.76302 17.0019 9.6973 16.9851 9.63924 16.9523C9.58118 16.9195 9.53286 16.8719 9.49923 16.8143C9.4656 16.7567 9.44786 16.6913 9.44782 16.6246V8.91698C9.44759 8.85018 9.46514 8.78451 9.49866 8.72673C9.53219 8.66895 9.58048 8.62112 9.63858 8.58816C9.69669 8.55519 9.76252 8.53828 9.82931 8.53916C9.89611 8.54003 9.96148 8.55866 10.0187 8.59313Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </g>
        <defs>
          <clipPath id="clip0_321_3042">
            <rect width="24.1004" height="24.1004" fill="white" transform="translate(0.410156 0.719818)" />
          </clipPath>
        </defs>
      </svg>
      Watch talk at ViteConf 2024
    </a>
  )
}

function GetStartedBtn() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8
      }}
    >
      <Link href={linkGetStarted}>
        <Button type="default" big>
          Get Started
        </Button>
      </Link>
    </div>
  )
}

function SpanAvoidBreakIfPossible({ children }: any) {
  return <span style={{ display: 'inline-block' }}>{children}</span>
}
