import React, { useRef, useState } from 'react'
import { Link } from '@brillout/docpress'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import BrandSubsection from './BrandSubsection'
import type { UspHoverTarget } from './intro.types'
import useIntroHeadlineGradientMotion from './useIntroHeadlineGradientMotion'
import { UiColorVariantKey } from '../../util/ui.constants'
import UspHeroMobile from './UspHero/UspHeroMobile'
import { Button } from '../../../index/components/button/Button'
import { linkGetStarted } from '../../../index/links'
import '../../../index/sections/hero/Hero.css'

const initialCtaColor: UiColorVariantKey = 'green'

function ReplacesLabel() {
  const slashOpacity = 0.65

  return (
    <span
      id="hero-badge"
      className="inline-flex overflow-hidden rounded-[6px] border border-[#d1d5db] text-[11px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
      style={{ marginTop: -6, marginBottom: 6 }}
    >
      <span className="flex items-center bg-[#eee] px-[10px] pr-2 tracking-[0.05em] leading-[1.3]">REPLACES</span>
      <span className="bg-[#8d8d8d] px-[11px] py-1 pl-2 text-[1.19em] leading-[1.2] font-[550] text-white">
        Next.js <span style={{ opacity: slashOpacity }}>/</span> Nuxt{' '}
        <span style={{ opacity: slashOpacity }}>/ ...</span>
      </span>
    </span>
  )
}

function LinkTagline({
  color,
  href,
  children,
}: {
  color: string
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      onClick={(ev) => {
        if (!href.startsWith('#')) return
        ev.preventDefault()
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }}
      data-vike={!href.startsWith('#')}
      style={{ color, borderBottom: `2px dotted ${color}` }}
    >
      {children}
    </a>
  )
}

const IntroSection = () => {
  const [manualHoverTarget, setManualHoverTarget] = useState<UspHoverTarget | null>(null)
  const [lastHoveredColor, setLastHoveredColor] = useState<UiColorVariantKey>(initialCtaColor)
  const firstTaglineRef = useRef<HTMLSpanElement>(null)
  const secondTaglineRef = useRef<HTMLSpanElement>(null)
  const activeColor = manualHoverTarget?.color ?? lastHoveredColor
  const activeUspId = manualHoverTarget?.id ?? null

  const handleUspHoverChange = (hoverTarget: UspHoverTarget | null) => {
    if (hoverTarget) {
      setLastHoveredColor(hoverTarget.color)
    }
    setManualHoverTarget(hoverTarget)
  }

  useIntroHeadlineGradientMotion({
    firstTextRef: firstTaglineRef,
    secondTextRef: secondTaglineRef,
    hoveredColor: activeColor,
  })

  return (
    <>
      <div data-intro-section-root="true" className="relative z-20">
        {/* <div className="absolute top-0 left-0 h-1/2 w-full bg-linear-to-t to-white z-10" /> */}
        <LayoutComponent
          $size="md"
          className="flex flex-col items-center text-center min-h-[calc(100svh-48*var(--spacing))]  overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <div className="mt-[45px] md:mt-[76px]">
              <ReplacesLabel />
            </div>
            <div style={{ height: 0 }} id="hero-margin-top-2" />
            <div id="hero-taglines">
              <div
                className="landingpage-hero-headline"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <h1
                  style={{
                    color: '#000000',
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: 0,
                    fontWeight: 580,
                  }}
                >
                  <div id="tagline-primary" style={{ letterSpacing: 0.7, opacity: 0.9 }}>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      Build{' '}
                      <GradientText ref={firstTaglineRef} color="orange" rotation={315} style={{ fontWeight: 700 }}>
                        fast
                      </GradientText>
                      .
                    </span>{' '}
                    <span style={{ whiteSpace: 'nowrap' }}>
                      Build{' '}
                      <GradientText ref={secondTaglineRef} color="blue" rotation={315} style={{ fontWeight: 700 }}>
                        right
                      </GradientText>
                      .
                    </span>
                  </div>
                  <div
                    id="tagline-secondary"
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      margin: 'auto',
                      marginTop: 10,
                      lineHeight: 1.35,
                      fontWeight: 450,
                      color: '#878787',
                      maxWidth: 800,
                    }}
                  >
                    <>
                      Composable framework to build advanced applications, with blazing-fast{' '}
                      <LinkTagline href="/new" color="#fe9618">
                        quick&nbsp;start
                      </LinkTagline>
                      , next-generation{' '}
                      <LinkTagline href="#full-fledged" color="#fed518">
                        DX
                      </LinkTagline>
                      , unprecedented{' '}
                      <LinkTagline href="#flexible" color="#18cbfa">
                        flexibility
                      </LinkTagline>
                      , and foundational{' '}
                      <LinkTagline href="#stable" color="#1878ed">
                        stability
                      </LinkTagline>
                      .
                    </>
                  </div>
                </h1>
              </div>
            </div>
            <div style={{ height: 37 }} className="md:hidden" />
            <div style={{ height: 50 }} className="hidden md:block" id="hero-margin-mid-1" />
            <div className="flex justify-center">
              <Link href={linkGetStarted}>
                <Button type="default" big>
                  Get Started
                </Button>
              </Link>
            </div>
            <div style={{ height: 43 }} className="md:hidden" />
            <div style={{ height: 52 }} className="hidden md:block" id="hero-margin-mid-2" />
            <UspHero onHoverChange={handleUspHoverChange} activeUspId={activeUspId} />
            <UspHeroMobile />
          </div>
        </LayoutComponent>
      </div>
      <div className="w-full">
        <LayoutComponent className="relative z-2">
          <BrandSubsection />
        </LayoutComponent>
      </div>
    </>
  )
}

export default IntroSection
