import React, { useEffect, useRef } from 'react'
import iconVikeAnimatedCover from '../../../../images/icons/vike-nitedani-animated-cover.jpg'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/Button/Button'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../+Page'
import './philosophy.css'

const stylePrefix = 'landingpage-philosophy'

const data = {
  caption: 'Philosophy',
  title: 'How Vike is Built.',
  buttonLabel: 'Read more',
  buttonLink: '/docs'
}

const principles = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 25 25">
        <path
          fill="currentColor"
          d="M13.554 1.999v20.083h-2.008V2zM2.508 5.01h7.03V19.07h-7.03zM4.516 7.02v10.042H7.53V7.02zm11.046-2.008h7.03V19.07h-7.03zm2.009 2.008v10.042h3.012V7.02z"
        ></path>
      </svg>
    ),
    title: 'Separation of concerns',
    href: '/'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 25 25">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12.548 12.245v.01m7.1-7.11c-1.568-1.569-6.024.338-9.94 4.26-3.922 3.922-5.83 8.372-4.26 9.942 1.568 1.567 6.025-.34 9.94-4.262 3.922-3.921 5.83-8.37 4.26-9.94"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5.447 5.145c-1.568 1.568.339 6.025 4.261 9.941 3.922 3.922 8.372 5.829 9.942 4.26 1.567-1.569-.34-6.025-4.262-9.942-3.921-3.92-8.371-5.828-9.94-4.26"
        ></path>
      </svg>
    ),
    title: 'Flourishing do-one-thing-do-it-well ecosystem',
    href: '/'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0m16 0a8 8 0 1 0-16 0" />
        </g>
      </svg>
    ),
    title: 'User-driven',
    href: '/'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 48 48">
        <g fill="none">
          <path d="M21.37 36c1.45-5.25 6.52-9 12.36-8.38c5.56.59 9.98 5.28 10.26 10.86c.07 1.47-.13 2.88-.56 4.19c-.26.8-1.04 1.33-1.89 1.33H11.758c-5.048 0-8.834-4.619-7.844-9.569L10 4h12l4 7l-8.57 6.13L15 14" />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            strokeWidth="4"
            d="M21.37 36c1.45-5.25 6.52-9 12.36-8.38c5.56.59 9.98 5.28 10.26 10.86c.07 1.47-.13 2.88-.56 4.19c-.26.8-1.04 1.33-1.89 1.33H11.758c-5.048 0-8.834-4.619-7.844-9.569L10 4h12l4 7l-8.57 6.13L15 14m2.44 3.13L22 34"
          />
        </g>
      </svg>
    ),
    title: 'Strong leadership',
    href: '/'
  }
]

export const Philosophy = () => {
  return (
    <div
      style={{
        width: '100%',
        marginTop: '120px'
      }}
    >
      <Grid>
        <TextBox>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end'
            }}
          >
            <SectionTextCollection caption={data.caption} title={data.title} />
            <div
              style={{
                margin: '20px 0'
              }}
            >
              <Button type="secondary">{data.buttonLabel}</Button>
            </div>
          </div>
        </TextBox>
      </Grid>
      <div
        style={{
          borderTop: `3px solid #FFFFFF`,
          marginTop: '24px'
        }}
      >
        <Grid>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)'
            }}
          >
            <div
              style={{
                borderRight: '3px solid #FFFFFF',
                borderLeft: '3px solid #FFFFFF',
                gridColumn: '1 / span 7',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#EBEBEF'
              }}
            >
              <VikeNitedaniAnimated />
            </div>
            <div
              style={{
                gridColumn: '8 / span 5',
                borderRight: '3px solid #FFFFFF'
              }}
            >
              {principles.map((principle, i) => (
                <a
                  key={i}
                  href={principle.href}
                  className={`${stylePrefix}-principle`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: i === 0 ? '' : `3px solid #FFF`,
                    padding: '20px',
                    color: 'rgba(0,0,0,0.7)'
                  }}
                >
                  <div
                    style={{
                      marginRight: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {principle.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      margin: 0
                    }}
                  >
                    {principle.title}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </Grid>
      </div>
    </div>
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

  return <video ref={ref} poster={iconVikeAnimatedCover} width="120" muted loop />
}
