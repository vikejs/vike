import React from 'react'
import vikeLogo from '../../../assets/logo/vike.svg'
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import gsap from 'gsap'

const Footer = () => {
  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin)
  })

  const handleScrollToTopClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' })
  })

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto text-center">
        <video
          poster="https://github.com/vikejs/vike-logo-3d/raw/refs/heads/main/vike-logo-animdated-cover.webp"
          src="https://github.com/vikejs/vike-logo-3d/raw/refs/heads/main/vike-logo-animdated.webm"
          width="70"
          height="70"
          autoPlay
          muted
          loop
          className="hidden md:block mx-auto w-30"
        />
        <img src={vikeLogo} width="150" className="block md:hidden mx-auto w-12 sm:w-24 h-auto" loading="lazy" />
        <a href="#intro-section" onClick={handleScrollToTopClick} className="text-grey mt-6 inline-block underline!">
          return to top
        </a>
      </div>
    </footer>
  )
}

export default Footer