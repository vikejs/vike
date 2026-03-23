import React, { useEffect, useRef } from 'react'
import vikeLogo from '../../../assets/logo/vike.svg'
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import gsap from 'gsap'

const Footer = () => {
  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin)
  })

  const handleScrollToTopClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault()
    gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' })
  })

  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto text-center">
        <div onClick={handleScrollToTopClick} className="cursor-pointer">
          <VikeNitedaniAnimated width="70" height="70" className="hidden md:block mx-auto w-30 py-8 mt-20" />
          <img
            src={vikeLogo}
            width="150"
            className="block md:hidden mx-auto w-12 sm:w-24 h-auto mt-10"
            loading="lazy"
          />
          <div className="h-7 md:h-14" />
        </div>
      </div>
    </footer>
  )
}

export default Footer

// 3D model: https://github.com/vikejs/vike-logo-3d
// 3D model to video: https://gist.github.com/brillout/73624de22e636977b7738e2946c8df9e
function VikeNitedaniAnimated(props: React.VideoHTMLAttributes<HTMLVideoElement>) {
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
      //*/
    }
  })

  return (
    <video
      poster="https://github.com/vikejs/vike-logo-3d/raw/refs/heads/main/vike-logo-animdated-cover.webp"
      ref={ref}
      muted
      loop
      {...props}
    />
  )
}
