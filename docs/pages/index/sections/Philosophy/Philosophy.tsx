import React, { useEffect, useRef } from 'react'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/Button/Button'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../Grid'
import './philosophy.css'
import { earIcon } from '../../icons'

const iconSize = 28

const principles = [
  {
    icon: (
      <svg
        style={{ width: iconSize - 3 }}
        fill="none"
        version="1.1"
        viewBox="0 0 20.084 20.084"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m11.046 0v20.083h-2.008v-20.082zm-11.046 3.011h7.03v14.06h-7.03zm2.008 2.01v10.042h3.014v-10.042zm11.046-2.008h7.03v14.058h-7.03zm2.009 2.008v10.042h3.012v-10.042z"
          fill="currentColor"
          stroke="#f5f5f5"
          strokeWidth=".4"
        />
      </svg>
    ),
    title: 'Separation of concerns',
    href: '/why#separation-of-concerns'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height={iconSize} viewBox="-5 -10 90.613 90.625">
        <path
          stroke="#000"
          strokeWidth="0.4"
          d="M83.613 56.11h-.008c-2.09.012-4.18.078-6.262.203V43.004c4.395-.808 7.77-5.32 7.77-10.75 0-6-4.121-10.883-9.184-10.883s-9.183 4.883-9.183 10.883c0 5.43 3.375 9.942 7.77 10.75V56.52c-4.977.422-9.91 1.168-14.786 2.235V20.329h7.903a1.42 1.42 0 0 0 1.355-1.832L60.957-7.56a2.75 2.75 0 0 0-2.64-1.94 2.75 2.75 0 0 0-2.641 1.94l-8.032 26.056c-.132.43-.054.898.215 1.257.266.364.692.575 1.14.575h7.903v39.086a113.383 113.383 0 0 0-15.2 4.89 128 128 0 0 0-8.448-2.11V51.802h17.918a2.657 2.657 0 0 0 2.203-4.145L42.629 31.75h5.344a2.344 2.344 0 0 0 1.945-3.66l-9.977-14.766h3.22c.874 0 1.671-.48 2.077-1.254s.352-1.703-.144-2.422L34.024-6.414a2.657 2.657 0 0 0-4.375 0L18.579 9.652a2.34 2.34 0 0 0-.145 2.422 2.34 2.34 0 0 0 2.078 1.254h3.22l-9.977 14.766a2.34 2.34 0 0 0-.13 2.414 2.34 2.34 0 0 0 2.075 1.246h5.344L10.298 47.66a2.65 2.65 0 0 0-.145 2.735c.461.867 1.36 1.41 2.348 1.41h17.918v9.812c-9.067-1.77-17.672-2.59-24.266-2.965v-19.55h6.394a1.42 1.42 0 0 0 1.355-1.832L7.169 15.42c-.328-1.07-1.308-1.789-2.433-1.789s-2.102.72-2.434 1.79l-6.734 21.847c-.133.43-.055.899.215 1.258.265.363.691.574 1.14.574h6.395v19.41c-2.602-.109-4.774-.144-6.39-.152h-.009A1.423 1.423 0 0 0-4.5 59.777v18.93c0 .781.633 1.418 1.418 1.418h86.7c.78 0 1.417-.633 1.417-1.418V57.535c0-.379-.148-.738-.418-1.004a1.41 1.41 0 0 0-1-.414zM69.578 32.251c0-4.437 2.848-8.047 6.352-8.047s6.351 3.61 6.351 8.047c0 3.82-2.113 7.023-4.933 7.844v-4.746a1.418 1.418 0 1 0-2.836 0v4.746c-2.82-.817-4.934-4.024-4.934-7.844zM58.308-6.507l7.398 24H50.91zM24.874 31.126a1.416 1.416 0 0 0-1.172-2.21h-7.094L27.561 12.7a1.416 1.416 0 0 0-1.172-2.21h-4.957L31.83-4.6l10.398 15.09h-4.957c-.523 0-1.003.288-1.25.753s-.214 1.023.079 1.457l10.953 16.215h-7.094a1.416 1.416 0 0 0-1.172 2.21l12.05 17.841H12.823zM4.726 17.142l5.895 19.117H-1.164L4.73 17.142zm-6.394 44.059c6.585.094 19.484.68 33.19 3.523a133.632 133.632 0 0 1 5.945 1.371 114 114 0 0 0-19.542 11.188H-1.673V61.205zm83.867 16.078H22.933c15.938-10.504 34.07-16.66 53.05-18.039.043-.004.086-.004.13-.012q3.03-.216 6.085-.27z"
        ></path>
      </svg>
    ),
    title: 'Flourishing do-one-thing-do-it-well ecosystem',
    href: '/why#flourishing-do-one-thing-do-it-well-ecosystem'
  },
  {
    icon: <img src={earIcon} style={{ width: iconSize + 8, marginLeft: -4, marginRight: -4 }} />,
    title: 'Listening to users',
    href: '/why#listening-to-users'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="-3.2 -6.4 64 64">
        <path d="M28.8-6.4c-17.6 0-32 14.4-32 32s14.4 32 32 32 32-14.4 32-32-14.4-32-32-32m0 61.1c-16.1 0-29.1-13-29.1-29.1s13-29.1 29.1-29.1 29.1 13 29.1 29.1-13 29.1-29.1 29.1"></path>
        <path d="M46.9 7.5C42.2 2.8 35.8 0 28.8 0S15.4 2.9 10.7 7.5h-.1c-.1 0 0 0 0 .1-4.6 4.6-7.4 11-7.4 18S6.1 39 10.7 43.7v.1c0 .1 0 0 .1 0 4.6 4.6 11 7.5 18.1 7.5 7 0 13.4-2.9 18.1-7.5h.1v-.1c4.6-4.6 7.5-11 7.5-18.1-.2-7-3-13.4-7.7-18.1M49.4 27h2.1c-.3 5.2-2.4 9.9-5.6 13.6l-1.5-1.5c-.6-.6-1.5-.6-2 0-.6.6-.6 1.5 0 2l1.5 1.5c-3.7 3.2-8.4 5.3-13.6 5.6v-2.1c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v2.1c-5.2-.3-9.9-2.4-13.6-5.6l1.5-1.5c.6-.6.6-1.5 0-2-.6-.6-1.5-.6-2 0l-1.7 1.5C8.5 36.9 6.4 32.2 6.1 27h2.1c.8 0 1.4-.6 1.4-1.4s-.6-1.4-1.4-1.4H6.1c.3-5.2 2.4-9.9 5.6-13.6l1.5 1.5c.3.3.6.4 1 .4s.7-.1 1-.4c.6-.6.6-1.5 0-2l-1.4-1.6c3.7-3.2 8.4-5.3 13.6-5.6V5c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4V2.9c5.2.3 9.9 2.4 13.6 5.6L42.3 10c-.6.6-.6 1.5 0 2 .3.3.6.4 1 .4s.7-.1 1-.4l1.5-1.5c3.2 3.7 5.3 8.4 5.6 13.6h-2.1c-.8 0-1.4.6-1.4 1.4s.7 1.5 1.5 1.5"></path>
        <path d="m39.2 13.2-14 8.6c-.2.1-.3.3-.5.5L16.3 36c-.3.6-.3 1.3.2 1.8.3.3.6.4 1 .4.3 0 .5-.1.8-.2l14-8.6c.2-.1.3-.3.5-.5l8.4-13.7c.3-.6.3-1.3-.2-1.8s-1.2-.6-1.8-.2m-8.7 13.9L22 32.4l5.1-8.3 8.5-5.3z"></path>
        <path d="M28.6 27.3c.4 0 .7-.1 1-.4l.5-.5c.6-.6.6-1.5 0-2-.6-.6-1.5-.6-2 0l-.5.5c-.6.6-.6 1.5 0 2 .2.2.6.4 1 .4"></path>
      </svg>
    ),
    title: 'Passionate leadership',
    href: '/why#passionate-leadership'
  }
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
                marginBottom: '20px'
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
          marginTop: '24px'
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
                    borderTop: i === 0 ? undefined : `3px solid #FFF`
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
