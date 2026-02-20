import React, { type MouseEvent, useCallback, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { H3Headline } from '../../components/Headline'
import cm, { cmMerge } from '@classmatejs/react'
import { landingPageHeroUsps } from '../../util/constants'
import GradientText from '../../components/GradientText'
import { uiConfig, UiVariantBgColor, UiVariantBtnColor } from '../../util/ui.constants'
import { ChevronsRight } from 'lucide-react'
import type { UspHoverTarget } from './intro.types'
import BlurDot from '../../components/BlurDot'
import ledgeGraphic from '../../assets/decorators/box/ledge.png'

export type UspProgressAnimationMode = 'gsap' | 'css'

interface UspHeroProps {
  activeUspId: string | null
  slideshowCycle: number
  slideshowDurationMs: number
  isSlideshowMode: boolean
  animationsEnabled?: boolean
  progressAnimationMode?: UspProgressAnimationMode
  onHoverChange?: (hoverTarget: UspHoverTarget | null) => void
  onSlideshowActiveChange?: (isActive: boolean) => void
}

let scrollTriggerRegistered = false

const registerScrollTrigger = () => {
  if (scrollTriggerRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

const UspHero = ({
  onHoverChange,
  activeUspId,
  slideshowCycle,
  slideshowDurationMs,
  isSlideshowMode,
  animationsEnabled = true,
  progressAnimationMode = 'css',
  onSlideshowActiveChange,
}: UspHeroProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const hoverLeaveTimeoutRef = useRef<number | null>(null)
  const progressFillRefs = useRef<Partial<Record<string, HTMLDivElement | null>>>({})
  const progressTweenRef = useRef<gsap.core.Tween | null>(null)
  const slideshowActiveRef = useRef<boolean | null>(null)
  const slideshowInViewRef = useRef(false)
  const isCompactDockedRef = useRef(false)

  const setSlideshowActive = useCallback(
    (isActive: boolean) => {
      if (slideshowActiveRef.current === isActive) {
        return
      }
      slideshowActiveRef.current = isActive
      onSlideshowActiveChange?.(isActive)
    },
    [onSlideshowActiveChange],
  )
  const syncSlideshowActive = useCallback(() => {
    setSlideshowActive(slideshowInViewRef.current && !isCompactDockedRef.current)
  }, [setSlideshowActive])
  const clearHoverLeaveTimeout = useCallback(() => {
    if (hoverLeaveTimeoutRef.current === null) {
      return
    }
    window.clearTimeout(hoverLeaveTimeoutRef.current)
    hoverLeaveTimeoutRef.current = null
  }, [])

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>, uspId: string, dotColor: UspHoverTarget['color']) => {
      clearHoverLeaveTimeout()
      const rect = event.currentTarget.getBoundingClientRect()
      onHoverChange?.({
        id: uspId,
        color: dotColor,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    },
    [clearHoverLeaveTimeout, onHoverChange],
  )

  const handleMouseLeave = useCallback(() => {
    clearHoverLeaveTimeout()
    hoverLeaveTimeoutRef.current = window.setTimeout(() => {
      onHoverChange?.(null)
      hoverLeaveTimeoutRef.current = null
    }, 90)
  }, [clearHoverLeaveTimeout, onHoverChange])

  useGSAP(
    () => {
      progressTweenRef.current?.kill()
      progressTweenRef.current = null

      if (progressAnimationMode !== 'gsap' || !animationsEnabled) {
        return
      }

      const progressFills = Object.values(progressFillRefs.current).filter(
        (node): node is HTMLDivElement => node !== null && node !== undefined,
      )

      if (!progressFills.length) {
        return
      }

      gsap.set(progressFills, { xPercent: -100 })

      if (!isSlideshowMode || !activeUspId) {
        return
      }

      const activeProgressFill = progressFillRefs.current[activeUspId]
      if (!activeProgressFill) {
        return
      }

      const setXPercent = gsap.quickSetter(activeProgressFill, 'xPercent')
      const progressState = { value: -100 }
      progressTweenRef.current = gsap.to(progressState, {
        value: 0,
        duration: slideshowDurationMs / 1000,
        ease: 'none',
        overwrite: 'auto',
        onUpdate: () => {
          setXPercent(progressState.value)
        },
      })

      return () => {
        progressTweenRef.current?.kill()
        progressTweenRef.current = null
      }
    },
    {
      dependencies: [
        activeUspId,
        isSlideshowMode,
        slideshowCycle,
        slideshowDurationMs,
        progressAnimationMode,
        animationsEnabled,
      ],
    },
  )

  useGSAP(
    () => {
      const rootNode = rootRef.current
      if (!rootNode || typeof document === 'undefined') {
        setSlideshowActive(false)
        return
      }

      registerScrollTrigger()

      const navNode = rootNode.querySelector<HTMLElement>('[data-usp-hero-nav="true"]')
      const navChromeNode = rootNode.querySelector<HTMLElement>('[data-usp-hero-nav-chrome="true"]')
      const uspItemNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-item="true"]'))
      const iconNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-icon="true"]'))
      const ledgeNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-ledge="true"]'))
      const largeCopyNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-copy-large="true"]'))

      if (!navNode || !navChromeNode || !uspItemNodes.length) {
        setSlideshowActive(false)
        return
      }

      gsap.set(navChromeNode, {
        autoAlpha: 0,
        scaleX: 0.86,
        transformOrigin: 'center center',
        backgroundColor: 'rgb(255, 255, 255)',
      })
      gsap.set(uspItemNodes, { transformOrigin: 'center top' })
      gsap.set(iconNodes, { transformOrigin: 'center center' })
      gsap.set(ledgeNodes, { autoAlpha: 1 })
      gsap.set(largeCopyNodes, { autoAlpha: 1, y: 0 })

      const scroller = document.querySelector<HTMLElement>('body') ?? undefined

      const updateCompactDocked = (isDocked: boolean) => {
        if (isCompactDockedRef.current === isDocked) {
          return
        }
        isCompactDockedRef.current = isDocked
        syncSlideshowActive()
      }

      const slideshowTrigger = ScrollTrigger.create({
        id: 'intro-usp-hero-slideshow-trigger',
        trigger: rootNode,
        scroller,
        start: 'top 65%',
        end: 'bottom 45%',
        markers: false,
        onEnter: () => {
          slideshowInViewRef.current = true
          syncSlideshowActive()
        },
        onEnterBack: () => {
          slideshowInViewRef.current = true
          syncSlideshowActive()
        },
        onLeave: () => {
          slideshowInViewRef.current = false
          syncSlideshowActive()
        },
        onLeaveBack: () => {
          slideshowInViewRef.current = false
          syncSlideshowActive()
        },
      })

      const pinTrigger = ScrollTrigger.create({
        id: 'intro-usp-hero-sticky-nav-pin',
        trigger: rootNode,
        scroller,
        start: 'top top+=8',
        end: 'max',
        pin: navNode,
        pinSpacing: false,
        anticipatePin: 0.3,
        invalidateOnRefresh: true,
        markers: false,
      })

      const compactTimeline = gsap.timeline({
        defaults: { ease: 'none', overwrite: 'auto' },
        scrollTrigger: {
          id: 'intro-usp-hero-sticky-nav-trigger',
          trigger: rootNode,
          scroller,
          start: 'top 25%',
          end: 'top top+=8',
          scrub: true,
          markers: false,
          onEnter: () => updateCompactDocked(false),
          onEnterBack: () => updateCompactDocked(false),
          onLeave: () => updateCompactDocked(true),
          onLeaveBack: () => updateCompactDocked(false),
        },
      })

      compactTimeline.to(
        navChromeNode,
        {
          autoAlpha: 1,
          duration: 1,
          scaleX: 1,
        },
        0,
      )
      compactTimeline.to(
        uspItemNodes,
        {
          y: -12,
          duration: 1,
          stagger: 0.05,
        },
        0,
      )
      compactTimeline.to(
        iconNodes,
        {
          scale: 0.58,
          y: -6,
          duration: 1,
          stagger: 0.02,
        },
        0,
      )
      compactTimeline.to(
        ledgeNodes,
        {
          autoAlpha: 0,
          duration: 1,
          stagger: 0.02,
        },
        0,
      )
      compactTimeline.to(
        largeCopyNodes,
        {
          autoAlpha: 0,
          y: -12,
          duration: 1,
        },
        0,
      )

      slideshowInViewRef.current = slideshowTrigger.isActive
      isCompactDockedRef.current = (compactTimeline.scrollTrigger?.progress ?? 0) >= 0.999
      syncSlideshowActive()

      return () => {
        slideshowTrigger.kill()
        pinTrigger.kill()
        compactTimeline.kill()
        slideshowInViewRef.current = false
        isCompactDockedRef.current = false
        setSlideshowActive(false)
      }
    },
    { dependencies: [setSlideshowActive, syncSlideshowActive] },
  )

  useEffect(() => {
    return () => {
      clearHoverLeaveTimeout()
      progressTweenRef.current?.kill()
      progressTweenRef.current = null
      setSlideshowActive(false)
    }
  }, [clearHoverLeaveTimeout, setSlideshowActive])

  return (
    <div ref={rootRef} className="w-full" data-usp-hero>
      <div data-usp-hero-nav="true" className="relative z-20 py-2">
        <div
          data-usp-hero-nav-chrome="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-16 w-full max-w-[1100px] -translate-x-1/2 shadow-lg rounded-box overflow-hidden"
        />
        <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto px-2 py-2">
          {landingPageHeroUsps.map((usp) => {
            const isHovered = activeUspId === usp.id
            const isMuted = activeUspId !== null && !isHovered

            return (
              <div
                className={cmMerge(
                  `relative cursor-pointer transition-[filter,opacity] ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw} rounded-lg`,
                  isMuted ? 'grayscale opacity-65' : 'grayscale-0 opacity-100',
                )}
                data-usp-item="true"
                data-usp-color={usp.dotColor}
                data-usp-id={usp.id}
                key={usp.title}
                onMouseEnter={(event) => handleMouseEnter(event, usp.id, usp.dotColor)}
                onMouseLeave={handleMouseLeave}
              >
                <BlurDot
                  type={usp.dotColor}
                  size="md"
                  visibility="low"
                  className="left-1/2 top-10 -translate-x-1/2 -translate-y-1/2"
                />
                <StyledUspItemInner $hovered={isHovered}>
                  <img
                    src={ledgeGraphic}
                    alt=""
                    data-usp-ledge="true"
                    className="absolute w-full h-full z-2 object-cover"
                  />
                </StyledUspItemInner>
                <StyledTextContent $hovered={isHovered}>
                  {/* todo: use more classmatejs */}
                  <StyledIconWrapper data-usp-icon="true">{usp.icon}</StyledIconWrapper>
                  <div data-usp-copy-large="true" className="text-center h-full flex flex-col flex-1 p-5">
                    <div className="flex-1 min-h-32">
                      <H3Headline as="h2" className="mb-2">
                        <span className="relative block w-fit mx-auto">
                          <StyledTitleShape $hovered={isHovered}>{usp.title}</StyledTitleShape>
                          <StyledTitle className={'absolute left-0 top-0 transition-opacity'}>
                            <GradientText color={usp.dotColor}>{usp.title}</GradientText>
                          </StyledTitle>
                        </span>
                      </H3Headline>
                      <div className="relative h-0.5 w-3/4 mb-3 mx-auto">
                        {isSlideshowMode && isHovered && animationsEnabled && (
                          <div className="pointer-events-none bottom-2 h-full w-full bg-transparent rounded-full overflow-hidden z-8">
                            <div
                              key={progressAnimationMode === 'css' ? `${usp.id}-${slideshowCycle}` : undefined}
                              ref={
                                progressAnimationMode === 'gsap'
                                  ? (node) => {
                                      progressFillRefs.current[usp.id] = node
                                    }
                                  : undefined
                              }
                              className={cmMerge('h-full w-full rounded-full', UiVariantBgColor[usp.dotColor])}
                              style={
                                {
                                  transform: 'translateX(-100%)',
                                  animation:
                                    progressAnimationMode === 'css'
                                      ? `usp-hero-progress-translate ${slideshowDurationMs}ms linear forwards`
                                      : undefined,
                                } as React.CSSProperties
                              }
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-lg">{usp.description}</p>
                    </div>
                    <span
                      className={cmMerge(
                        UiVariantBtnColor[usp.dotColor],
                        'btn btn-sm btn-ghost opacity-100 pointer-events-none',
                      )}
                    >
                      Learn more
                      <ChevronsRight className="inline-block w-3 h-3" />
                    </span>
                  </div>
                </StyledTextContent>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        @keyframes usp-hero-progress-translate {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
export default UspHero

const StyledUspItemInner = cm.div<{ $hovered?: boolean }>`
  pointer-events-none
  flex items-center
  absolute inset-0
  transition-[scale,opacity, transform]
  rounded-box 
  origin-bottom-center
  opacity-0
  scale-100
  translate-y-1
  z-3
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? 'scale-104 translate-y-0 opacity-80' : '')}
`

const StyledTitleShape = cm.span<{ $hovered?: boolean }>`
  transition-opacity z-3 relative
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? `opacity-20` : `opacity-0`)}
`

const StyledTitle = cm.span`
  absolute left-0 top-0
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
`

const StyledIconWrapper = cm.div`
  text-3xl md:text-5xl lg:text-7xl 
  text-center block mb-2
`

const StyledTextContent = cm.div<{ $hovered?: boolean }>`
  relative z-6
  transition-transform
  min-h-56
  flex flex-col justify-between
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? `-translate-y-1` : `translate-y-0`)}
`
