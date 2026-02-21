import { useGSAP } from '@gsap/react'
import { useRef, useCallback } from 'react'
import { registerScrollTrigger } from '../../../util/gsap.utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

interface UseUspHeroParams {
  onSlideshowActiveChange?: (isActive: boolean) => void
}

const useUspHero = ({ onSlideshowActiveChange }: UseUspHeroParams) => {
  const rootRef = useRef<HTMLDivElement>(null)
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

  const updateCompactDocked = useCallback(
    (isDocked: boolean) => {
      if (isCompactDockedRef.current === isDocked) {
        return
      }
      isCompactDockedRef.current = isDocked
      syncSlideshowActive()
    },
    [syncSlideshowActive],
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
      const contentInteractionNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-content-hit="true"]'),
      )
      const stickyInteractionNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-hit="true"]'))
      const iconNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-icon="true"]'))
      const blurDotNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('.js-usp-blur-dot'))

      if (!navNode || !navChromeNode || !contentInteractionNodes.length || !stickyInteractionNodes.length) {
        setSlideshowActive(false)
        return
      }

      gsap.set(navChromeNode, {
        autoAlpha: 0,
        scaleX: 0.86,
        scaleY: 1.6,
        transformOrigin: 'top center',
        backgroundColor: 'rgb(255, 255, 255)',
      })
      gsap.set(contentInteractionNodes, { pointerEvents: 'auto' })
      gsap.set(stickyInteractionNodes, { autoAlpha: 1, pointerEvents: 'none' })
      gsap.set(iconNodes, { transformOrigin: 'center center' })
      gsap.set(blurDotNodes, { transformOrigin: 'center center' })
      gsap.set([navChromeNode, ...iconNodes, ...blurDotNodes], { willChange: 'transform, opacity' })

      const scroller = document.querySelector<HTMLElement>('body') ?? undefined
      const setInteractionMode = (isStickyMode: boolean) => {
        gsap.set(contentInteractionNodes, { pointerEvents: isStickyMode ? 'none' : 'auto' })
        gsap.set(stickyInteractionNodes, { pointerEvents: isStickyMode ? 'auto' : 'none' })
      }
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-pin')?.kill()
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-trigger')?.kill()

      ScrollTrigger.create({
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
        onEnter: () => {
          slideshowInViewRef.current = false
          syncSlideshowActive()
        },
        onEnterBack: () => {
          slideshowInViewRef.current = false
          syncSlideshowActive()
        },
        onLeave: () => {
          slideshowInViewRef.current = true
          syncSlideshowActive()
        },
        onLeaveBack: () => {
          slideshowInViewRef.current = true
          syncSlideshowActive()
        },
      })

      const compactTimeline = gsap.timeline({
        defaults: { ease: 'none', overwrite: 'auto' },
        scrollTrigger: {
          id: 'intro-usp-hero-sticky-nav-trigger',
          trigger: rootNode,
          scroller,
          start: 'top top+=8',
          end: '+=280',
          scrub: true,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          markers: false,
          onEnter: () => {
            updateCompactDocked(false)
          },
          onEnterBack: () => {
            updateCompactDocked(false)
          },
          onLeave: () => {
            updateCompactDocked(true)
          },
          onLeaveBack: () => {
            updateCompactDocked(false)
          },
        },
      })

      compactTimeline.to(
        navChromeNode,
        {
          autoAlpha: 1,
          duration: 1,
          scaleX: 1,
          scaleY: 1,
        },
        0,
      )
      compactTimeline.to(
        iconNodes,
        {
          scale: 0.58,
          y: -20,
          duration: 1,
        },
        0,
      )
      compactTimeline.to(
        blurDotNodes,
        {
          scale: 0.5,
          y: -24,
          autoAlpha: 0.5,
          duration: 1,
        },
        0,
      )

      slideshowInViewRef.current = true
      isCompactDockedRef.current = (compactTimeline.scrollTrigger?.progress ?? 0) >= 0.999
      setInteractionMode(isCompactDockedRef.current)
      syncSlideshowActive()

      return () => {
        setInteractionMode(false)
        slideshowInViewRef.current = false
        isCompactDockedRef.current = false
        setSlideshowActive(false)
      }
    },
    { dependencies: [setSlideshowActive, syncSlideshowActive] },
  )

  return {
    setSlideshowActive,
    rootRef,
  }
}

export default useUspHero
