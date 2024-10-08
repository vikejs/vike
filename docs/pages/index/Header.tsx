import React from 'react'
import './HeaderLayout.css'
import iconVikeAnimatedCover from '../../images/icons/vike-nitedani-animated-cover.jpg'
import { navigate } from 'vike/client/router'
import { getFeatureId } from './getFeatureId'

export { Header }

function Header() {
  return (
    <div
      id="header-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'var(--bg-color)'
      }}
    >
      <a
        id="header-logo"
        href="/"
        style={{
          height: 230,
          marginRight: 45,
          marginTop: -30
        }}
      >
        <VikeNitedaniAnimated />
      </a>
      <div>
        <h1
          style={{
            margin: 0,
            lineHeight: '1.1em',
            marginBottom: 8
          }}
        >
          Next Generation
          <br />
          Frontend Framework
        </h1>
        <p
          id="header-tagline"
          style={{
            padding: 0,
            marginTop: 14,
            maxWidth: 550
          }}
        >
          {/* &#8288; for non-breaking hyphen */}
          Next.js/Nuxt alternative. <FeatureName>Flexible</FeatureName>, <FeatureName>reliable</FeatureName>,{' '}
          <FeatureName>fast</FeatureName>, <FeatureName>clutter&#8288;-&#8288;free</FeatureName>,{' '}
          <FeatureName>community&#8288;-&#8288;driven</FeatureName>.
        </p>
      </div>
    </div>
  )
}

function VikeNitedaniAnimated() {
  // - Source: https://github.com/brillout/vike-hammer-nitedani#animated
  // - Spline Video export: https://www.youtube.com/watch?v=OgN8TZElx6M&t=130s
  // - If exporting as .webm => cut first frames with:
  //   ```
  //   # Cut first frames:
  //   ffmpeg -ss 00:00:00.050 -i input.webm -c copy output.webm
  //   # Check first frame:
  //   ffmpeg -vframes 1 first-frame.png -i input.webm
  //   ```
  //   https://stackoverflow.com/questions/23295278/looping-html5-video-flashes-a-black-screen-on-loop/49881222#49881222
  //   https://stackoverflow.com/questions/4425413/how-to-extract-the-1st-frame-and-restore-as-an-image-with-ffmpeg/67482024#67482024
  return (
    <video
      src="https://github.com/brillout/vike-hammer-nitedani/raw/refs/heads/main/vike-nitedani-animated.webm"
      poster={iconVikeAnimatedCover}
      height="250"
      width="182"
      muted
      autoPlay
      loop
      onContextMenu={(ev) => {
        navigate('/press#logo')
        ev.preventDefault()
      }}
    />
  )
}

function FeatureName({ children }: { children: string }) {
  const featureId = getFeatureId(
    children
      // Remove &#8288;
      .replace(/\u2060/g, '')
  )
  return (
    <a
      style={{
        color: 'inherit',
        textDecoration: 'underline',
        textUnderlineOffset: '0.14em',
        textDecorationThickness: 2,
        textDecorationColor: `var(--color-${featureId}`
      }}
      href={`#${featureId}`}
    >
      {children}
    </a>
  )
}
