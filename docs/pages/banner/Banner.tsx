export { Banner }

import React from 'react'
import { heroBgColor, HeroTagline } from '../index/sections/hero/Hero'
import vikeLogo from '../../assets/logo/vike.svg'

function Banner({ showLogo }: { showLogo: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: heroBgColor
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // Needs to have the right size upon 600x315 (that's the viewport we use to generate banner.png as explained in the HOW-TO above)
          scale: '1.3'
        }}
      >
        {showLogo && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: -14
            }}
          >
            <img src={vikeLogo} style={{ marginRight: 12, height: 48, objectFit: 'contain' }} />
            <span
              style={{
                fontSize: '2.7em',
                fontWeight: 450,
                color: 'black',
                opacity: 0.75,
                lineHeight: '1em'
              }}
            >
              Vike
            </span>
          </div>
        )}
        <HeroTagline />
      </div>
    </div>
  )
}
