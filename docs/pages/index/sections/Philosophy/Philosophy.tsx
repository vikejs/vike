import React, { useEffect, useRef } from 'react'
import iconVikeAnimatedCover from '../../../../images/icons/vike-nitedani-animated-cover.webp'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/Button/Button'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../Grid'
import './philosophy.css'

const data = {
  caption: 'Philosophy',
  title: 'How Vike is Built',
  buttonLabel: 'Read Philosophy',
  buttonLink: '/why#philosophy'
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
    href: '/why#separation-of-concerns'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -10 86.887 86.887">
        <path d="M64.137 56.477a11.2 11.2 0 0 0 6.418 2.004c6.25 0 11.332-5.086 11.332-11.336a11.36 11.36 0 0 0-5.168-9.5 9 9 0 0 0 .2-1.863 9.01 9.01 0 0 0-5.653-8.399 9.034 9.034 0 0 0-4.754-9.61c.273-.984.41-1.984.41-2.988 0-6.25-5.086-11.332-11.332-11.332-6.25 0-11.332 5.086-11.332 11.332 0 1.383.25 2.735.746 4.028a9 9 0 0 0-1.027.719c-.527-2.696-2.23-5.028-4.707-6.305.273-.985.41-1.985.41-2.988 0-6.25-5.086-11.332-11.332-11.332a11.26 11.26 0 0 0-9.96 5.933L15.398-.18 1.172 23.54h5.637l-8.582 14.312h6.859L-5 54.672h17.387V66.28l-12.469-.004c-.469 0-.852.383-.852.851s.383.852.852.852h74.145c.469 0 .852-.383.852-.852s-.383-.851-.852-.851H58.864v-7.77a14.6 14.6 0 0 0 5.273-2.031zm-6.977 9.8h-3.386v-7.76c.824.144 1.664.226 2.515.226q.434-.001.867-.032zm-43.07 0V54.674h3.387v11.609zm1.297-63.132 2.168 3.636.09.153 6.2 10.414-.934 1.297c-.324.449-.645.976-.969 1.554q-.235.423-.465.88-.186.369-.37.761H4.171zm31.07 16.82.754-.367-.351-.758a9.55 9.55 0 0 1-.903-4.047c0-5.313 4.32-9.633 9.633-9.633s9.633 4.32 9.633 9.633a9.6 9.6 0 0 1-.543 3.164l-.266.758.743.308a7.34 7.34 0 0 1 4.554 6.805 7.4 7.4 0 0 1-.254 1.89l-.21.79.78.242a7.32 7.32 0 0 1 5.196 7.035c0 .672-.098 1.356-.29 2.027l-.183.641.578.332a9.66 9.66 0 0 1 4.864 8.36c0 5.312-4.32 9.632-9.633 9.632a9.54 9.54 0 0 1-5.875-2.011l-.492-.38-.512.352a13 13 0 0 1-4.82 2.035q-.424.084-.852.145-.422.06-.851.086-.406.03-.817.031v-5.137l12.941-10.352a.85.85 0 1 0-1.062-1.328l-11.88 9.504.005-17.98 8.062-6.53a.847.847 0 0 0 .125-1.196.847.847 0 0 0-1.195-.125l-6.992 5.664V15.477c0-.469-.383-.852-.852-.852s-.852.383-.852.852v25.035l-8.48-6.137a.85.85 0 0 0-.996 1.38l9.476 6.858V56.93q-.44-.058-.867-.14a13 13 0 0 1-1.703-.453 13 13 0 0 1-3.383-1.75l-.586-.422-.511.512a7.32 7.32 0 0 1-5.2 2.148 8 8 0 0 1-.628-.031 15 15 0 0 0 1.12-1.82c3.864-7.516 2.317-20.04-.562-28.72a7.24 7.24 0 0 1 1.336-3.902 7.341 7.341 0 0 1 2.8-2.387zm-4.57 10.703q.11.438.215.883c1.805 7.656 2.285 16.773-.73 22.64-.423.82-.919 1.536-1.462 2.188-.195.238-.394.469-.605.684q-.324.329-.672.629c-1.82 1.543-4.14 2.382-6.93 2.527l-.003-5.547v-5.367c.003-.004.011-.004.015-.008l.485-.473 1.378-1.343 1.301-1.27 4.45-4.34.218-.21.172-.169a.851.851 0 0 0-1.187-1.218l-.41.402-6.419 6.262v-9.086l-.003-1.266v-2.414l5.582-5.156a.852.852 0 0 0-1.157-1.25l-4.43 4.09v-8.817c0-.468-.382-.851-.851-.851s-.852.383-.852.851v15.262l-.515-.445c-.29-.246-.621-.523-1.012-.852l-1.031-.851c-1.098-.902-2.5-2.047-4.332-3.535a.84.84 0 0 0-.664-.172.83.83 0 0 0-.531.297.9.9 0 0 0-.133.25.85.85 0 0 0 .254.945l.597.488c.606.492 1.262 1.031 1.93 1.578.063.051.121.102.184.149q.52.428 1.035.851c.351.29.7.575 1.031.852 1.438 1.191 2.606 2.176 2.867 2.437.082.114.196.2.324.262v14.371l-.32-.25-2.187-1.703-6.375-4.953a.852.852 0 1 0-1.047 1.344l4.644 3.61 2.188 1.702 3.094 2.406v3.145c-4.262-.219-7.414-2.082-9.387-5.547-.094-.164-.2-.309-.285-.477-.063-.12-.117-.25-.176-.37a19 19 0 0 1-.379-.852c-1.71-4.2-1.926-9.703-1.293-15.117l.106-.852q.058-.425.12-.851c.258-1.707.59-3.387.981-5a66.819 66.819 0 0 1 .61-2.297 45 45 0 0 1 1.78-5.086c.032-.074.063-.153.098-.227.11-.25.215-.492.325-.726q.03-.06.058-.125.194-.412.387-.793c.008-.02.02-.04.027-.059a17.5 17.5 0 0 1 1.313-2.203c.152-.21.32-.45.5-.695l.543-.754.543-.75c1.761-2.434 3.964-5.453 5.066-6.969 1.43 2.04 4.742 6.758 6.461 9.164 1.102 1.54 2.227 3.906 3.203 6.738.48 1.332.914 2.778 1.293 4.29zM29.305 61.883c.504.043 1.012.086 1.543.086.719 0 1.41-.043 2.078-.117v4.43h-3.621zM13.668 23.539h6.695a47 47 0 0 0-1.207 3.383 61 61 0 0 0-.656 2.226 60 60 0 0 0-1.45 7H1.228L8.789 23.54zm3.164 14.312c-.61 5.363-.426 10.812 1.121 15.117H-1.996L7.071 37.85zm2.344 17.723c1.898 3.312 4.723 5.347 8.43 6.07v4.637h-8.43zm15.453 10.703v-4.73c2.316-.544 4.262-1.634 5.844-3.235.62.133 1.261.21 1.922.21 2.18 0 4.242-.765 5.879-2.163a14.6 14.6 0 0 0 3.8 1.765v8.157zM28.339.613c5.313 0 9.634 4.32 9.634 9.633a9.6 9.6 0 0 1-.543 3.164l-.266.758.742.308a7.33 7.33 0 0 1 4.54 6.621 9 9 0 0 0-1.223 2.18c-.782-1.89-1.614-3.485-2.434-4.633-2.23-3.117-7.133-10.125-7.133-10.125l-.68-.976-.703.96s-2.945 4.032-5.343 7.34l-5.504-9.246C20.89 2.984 24.375.613 28.34.613"></path>
      </svg>
    ),
    title: 'Do-one-thing-do-it-well ecosystem',
    href: '/why#do-one-thing-do-it-well-ecosystem'
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
    href: '/why#user-driven'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-3.2 -6.4 64 64">
        <path d="M28.8-6.4c-17.6 0-32 14.4-32 32s14.4 32 32 32 32-14.4 32-32-14.4-32-32-32m0 61.1c-16.1 0-29.1-13-29.1-29.1s13-29.1 29.1-29.1 29.1 13 29.1 29.1-13 29.1-29.1 29.1"></path>
        <path d="M46.9 7.5C42.2 2.8 35.8 0 28.8 0S15.4 2.9 10.7 7.5h-.1c-.1 0 0 0 0 .1-4.6 4.6-7.4 11-7.4 18S6.1 39 10.7 43.7v.1c0 .1 0 0 .1 0 4.6 4.6 11 7.5 18.1 7.5 7 0 13.4-2.9 18.1-7.5h.1v-.1c4.6-4.6 7.5-11 7.5-18.1-.2-7-3-13.4-7.7-18.1M49.4 27h2.1c-.3 5.2-2.4 9.9-5.6 13.6l-1.5-1.5c-.6-.6-1.5-.6-2 0-.6.6-.6 1.5 0 2l1.5 1.5c-3.7 3.2-8.4 5.3-13.6 5.6v-2.1c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v2.1c-5.2-.3-9.9-2.4-13.6-5.6l1.5-1.5c.6-.6.6-1.5 0-2-.6-.6-1.5-.6-2 0l-1.7 1.5C8.5 36.9 6.4 32.2 6.1 27h2.1c.8 0 1.4-.6 1.4-1.4s-.6-1.4-1.4-1.4H6.1c.3-5.2 2.4-9.9 5.6-13.6l1.5 1.5c.3.3.6.4 1 .4s.7-.1 1-.4c.6-.6.6-1.5 0-2l-1.4-1.6c3.7-3.2 8.4-5.3 13.6-5.6V5c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4V2.9c5.2.3 9.9 2.4 13.6 5.6L42.3 10c-.6.6-.6 1.5 0 2 .3.3.6.4 1 .4s.7-.1 1-.4l1.5-1.5c3.2 3.7 5.3 8.4 5.6 13.6h-2.1c-.8 0-1.4.6-1.4 1.4s.7 1.5 1.5 1.5"></path>
        <path d="m39.2 13.2-14 8.6c-.2.1-.3.3-.5.5L16.3 36c-.3.6-.3 1.3.2 1.8.3.3.6.4 1 .4.3 0 .5-.1.8-.2l14-8.6c.2-.1.3-.3.5-.5l8.4-13.7c.3-.6.3-1.3-.2-1.8s-1.2-.6-1.8-.2m-8.7 13.9L22 32.4l5.1-8.3 8.5-5.3z"></path>
        <path d="M28.6 27.3c.4 0 .7-.1 1-.4l.5-.5c.6-.6.6-1.5 0-2-.6-.6-1.5-.6-2 0l-.5.5c-.6.6-.6 1.5 0 2 .2.2.6.4 1 .4"></path>
      </svg>
    ),
    title: 'Leadership',
    href: '/why#leadership'
  }
]

export const Philosophy = () => {
  return (
    <div className="landingpage-philosophy-container">
      <Grid>
        <TextBox>
          <div className="landingpage-philosophy-headerFlexbox">
            <SectionTextCollection caption={data.caption} title={data.title} />
            <div
              style={{
                marginBottom: '20px'
              }}
            >
              <a href={data.buttonLink}>
                <Button type="secondary">{data.buttonLabel}</Button>
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
// - Create cover by converting last frame to webp:
//   ```bash
//   # Lossless
//   convert -format webp -quality 100% 483.png 483.webp # sudo apt-get install imagemagick
//   # Compressed
//   convert -format webp -quality 99% 483.png 483.webp # Changing 99% to 0% doesn't make any difference
//   ```
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

  return <video ref={ref} poster={iconVikeAnimatedCover} width="150" muted loop />
}
