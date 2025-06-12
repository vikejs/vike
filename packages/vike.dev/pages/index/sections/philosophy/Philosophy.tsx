import React, { useEffect, useRef } from 'react'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/button/Button'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../components/Grid'
import './Philosophy.css'
import EarIcon from './ear.svg?react'
import ForestIcon from './forest.svg?react'
import CompassIcon from './compass.svg?react'
import SeparationIcon from './separation.svg?react'
import { Icon, iconSizeDefault } from '../../components/Icon'

const iconColor = '#333'

const principles = [
  {
    icon: <Icon icon={<SeparationIcon />} size={iconSizeDefault + 0} color="#444" />,
    title: 'Separation of concerns',
    href: '/why#separation-of-concerns',
  },
  {
    icon: <Icon icon={<ForestIcon />} size={iconSizeDefault + 5} color={iconColor} />,
    title: 'Flourishing do-one-thing-do-it-well ecosystem',
    href: '/why#flourishing-do-one-thing-do-it-well-ecosystem',
  },
  {
    icon: (
      <Icon icon={<EarIcon />} size={iconSizeDefault + 8} color="#222" style={{ position: 'relative', left: -1 }} />
    ),
    title: 'Listening to users',
    href: '/why#listening-to-users',
  },
  {
    icon: <Icon icon={<CompassIcon />} size={iconSizeDefault + 2} color={iconColor} />,
    title: 'Passionate leadership',
    href: '/why#passionate-leadership',
  },
]

export const Philosophy = () => {
  return (
    <div className="landingpage-philosophy-container">
      <Grid>
        <TextBox>
          <div className="landingpage-philosophy-headerFlexbox">
            <SectionTextCollection caption="Philosophy" title="How Vike is Built" />
            <div
              style={{
                marginBottom: '20px',
              }}
            >
              <a href="/why#philosophy">
                <Button type="secondary" readingRecommendation>
                  Philosophy
                </Button>
              </a>
            </div>
          </div>
        </TextBox>
      </Grid>
      <div
        style={{
          borderTop: `3px solid #FFFFFF`,
          marginTop: '24px',
        }}
      >
        <Grid>
          <div className="landingpage-philosophy-principlesContainer">
            <div className="landingpage-philosophy-hammer">
              <VikeNitedaniAnimated />
            </div>
            <div className="landingpage-philosophy-principleBorders">
              {principles.map((principle, i) => (
                <a
                  key={i}
                  href={principle.href}
                  className="landingpage-philosophy-principle"
                  style={{
                    borderTop: i === 0 ? undefined : `3px solid #FFF`,
                  }}
                >
                  <div
                    style={{
                      marginRight: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {principle.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      margin: 0,
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

// 3D model: https://github.com/vikejs/vike-logo-3d
// 3D model to video: https://gist.github.com/brillout/73624de22e636977b7738e2946c8df9e
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
      videoEl.setAttribute('src', 'https://github.com/vikejs/vike-logo-3d/raw/refs/heads/main/vike-logo-animdated.webm')
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
      poster="https://github.com/vikejs/vike-logo-3d/raw/refs/heads/main/vike-logo-animdated-cover.webp"
      ref={ref}
      width="150"
      muted
      loop
    />
  )
}
