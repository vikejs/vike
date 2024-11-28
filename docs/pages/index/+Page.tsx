export { Page }

import React, { useEffect, useRef } from 'react'
import { Hero } from './sections/Hero'
import { Sponsors } from './sections/Sponsors'
import iconVikeAnimatedCover from '../../images/icons/vike-nitedani-animated-cover.jpg'
import { Flexible } from './sections/Flexible'
import { Reliable } from './sections/Reliable'
import { Features } from './sections/Features'

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
      <Block>
        <Philosophy />
      </Block>
      <Block>
        <div style={{ height: 60 }} />
        <Sponsors />
        <div style={{ height: 50 }} />
      </Block>
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
        padding: 20,
        marginTop: 'var(--block-margin)',
        ...style
      }}
    >
      {noGrid ? children : <Grid>{children}</Grid>}
    </div>
  )
}

export function Grid({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
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

function Philosophy() {
  return (
    <>
      <h2>How Vike is built.</h2>
      <VikeNitedaniAnimated />
    </>
  )
}

// - Video source: https://github.com/brillout/vike-hammer-nitedani
// - Spline Video export: https://www.youtube.com/watch?v=OgN8TZElx6M&t=130s
//   - Export as image sequence
//   - Trick: set 15 fps with 0.5x speed then create video with 30 fps
// - Convert to video:
//   ```bash
//   # resize
//   for f in *.png; do ffmpeg -i "$f" -vf scale=-1:250 "resized/$f"; done
//   # mp4
//   ffmpeg -framerate 30 -pattern_type glob -i '*.png' -crf 20 -preset veryslow -pix_fmt yuv420p -c:v libx264 out.mp4
//   # webm
//   ffmpeg -framerate 30 -pattern_type glob -i '*.png' -crf 30 -preset veryslow -pix_fmt yuva420p -c:v libvpx-vp9 out.webm
//   ```
//   Change `-crf 30` to increase/decrease quality/size.
//   https://stackoverflow.com/questions/34974258/convert-pngs-to-webm-video-with-transparency
function VikeNitedaniAnimated() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Avoid loading the video on mobile:
    // - To save KBs.
    // - To avoid weird mobile iOS Chrome bug(?): the video is automatically shown fullscreen when client-side navigating from another page to the landing page.
    // 759 => same as https://github.com/vikejs/vike/blob/2c6325615390ae3be3afc6aa37ede6914b935702/docs/pages/index/HeaderLayout.css#L24
    if (screen.width > 759) {
      const videoEl = ref.current!
      videoEl.setAttribute('autoPlay', '')
      videoEl.setAttribute(
        'src',
        'https://github.com/brillout/vike-hammer-nitedani/raw/refs/heads/main/vike-nitedani-animated.webm'
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

  return <video ref={ref} poster={iconVikeAnimatedCover} height="250" width="182" muted loop />
}
