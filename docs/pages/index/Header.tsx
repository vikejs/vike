import React, { useEffect, useRef } from 'react'
import iconVikeAnimatedCover from '../../images/icons/vike-nitedani-animated-cover.jpg'
import { navigate } from 'vike/client/router'
import { getFeatureId } from './getFeatureId'
import './Header.css'

export { Header }

function Header() {
  return (
    <>
      <div
        id="header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'var(--bg-color)',
          paddingLeft: 'var(--main-view-padding)',
          paddingRight: 'var(--main-view-padding)'
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
    </>
  )
}

// - Video source: https://github.com/brillout/vike-hammer-nitedani
// - Spline Video export: https://www.youtube.com/watch?v=OgN8TZElx6M&t=130s
// - Export as image sequence, then convert to video:
//   ```bash
//   ffmpeg -framerate 30 -pattern_type glob -i '*.png' -vf scale="-1:250" -crf 15 -preset veryslow -c:v libx264 -pix_fmt yuv420p out.mp4
//   ```
//   For .webm see https://stackoverflow.com/questions/34974258/convert-pngs-to-webm-video-with-transparency
function VikeNitedaniAnimated() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Avoid loading the video on mobile:
    // - To save KBs.
    // - To avoid weird mobile iOS Chrome bug(?): the video is automatically shown fullscren when client-side navigating from another page to the landing page.
    // 759 => same as https://github.com/vikejs/vike/blob/2c6325615390ae3be3afc6aa37ede6914b935702/docs/pages/index/HeaderLayout.css#L24
    if (screen.width > 759) {
      const videoEl = ref.current!
      videoEl.setAttribute('autoPlay', '')
      videoEl.setAttribute(
        'src',
        'https://github.com/brillout/vike-hammer-nitedani/raw/refs/heads/main/vike-nitedani-animated.mp4'
      )
      /* We don't use play() because in Firefox it flickers
      // try-catch to suppress the following in the CI:
      // ```bash
      // Failed to load because no supported source was found.
      // ```
      // In practice, the video always seems to be successfully loading?
      try {
        videoEl.play()
      } catch (_) {}
      */
    }
  })

  return (
    <video
      ref={ref}
      poster={iconVikeAnimatedCover}
      height="250"
      width="182"
      muted
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
        textDecorationColor: `var(--color-${featureId}`
      }}
      href={`#${featureId}`}
    >
      {children}
    </a>
  )
}
