import { useGSAP } from '@gsap/react'
import { useRef, useCallback } from 'react'
import { registerScrollTrigger } from '../../../util/gsap.utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import { uiConfig } from '../../../util/ui.constants'

interface UseUspHeroParams {
  onSlideshowActiveChange?: (isActive: boolean) => void
  onSectionActiveChange?: (uspId: string | null) => void
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

const useUspHero = ({ onSlideshowActiveChange, onSectionActiveChange }: UseUspHeroParams) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const slideshowActiveRef = useRef<boolean | null>(null)
  const activeSectionRef = useRef<string | null>(null)
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

  const setSectionActive = useCallback(
    (uspId: string | null) => {
      if (activeSectionRef.current === uspId) {
        return
      }
      activeSectionRef.current = uspId
      onSectionActiveChange?.(uspId)
    },
    [onSectionActiveChange],
  )

  useGSAP(
    () => {
      const rootNode = rootRef.current
      if (!rootNode || typeof document === 'undefined') {
        setSectionActive(null)
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
      const blurDotNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-dot]'))
      const sectionProgressFillNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-progress-fill]'),
      )
      const stickyProgressTrackNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-progress-track]'),
      )

      if (!navNode || !navChromeNode || !contentInteractionNodes.length || !stickyInteractionNodes.length) {
        setSectionActive(null)
        setSlideshowActive(false)
        return
      }

      const sectionProgressFillById = new Map<string, HTMLElement>()
      sectionProgressFillNodes.forEach((node) => {
        const id = node.getAttribute('data-usp-scroll-progress-fill')
        if (id) {
          sectionProgressFillById.set(id, node)
        }
      })

      const sectionIds = landingPageHeroUsps.map((usp) => usp.id)
      const sectionNodesById = new Map(
        sectionIds.map((id) => [id, document.querySelector<HTMLElement>(`[data-usp-section="${id}"]`)]),
      )
      const orderedSectionEntries = sectionIds
        .map((id) => ({ id, node: sectionNodesById.get(id) }))
        .filter((entry): entry is { id: UspId; node: HTMLElement } => Boolean(entry.node))

      const setSectionProgress = (id: string, progress: number) => {
        const clampedProgress = clamp01(progress)

        const sectionFillNode = sectionProgressFillById.get(id)
        if (sectionFillNode) {
          gsap.set(sectionFillNode, { scaleX: clampedProgress })
        }
      }
      const setIfAny = (targets: HTMLElement[], vars: gsap.TweenVars) => {
        if (!targets.length) {
          return
        }
        gsap.set(targets, vars)
      }

      gsap.set(navChromeNode, {
        autoAlpha: 0,
        scaleX: 0.86,
        scaleY: 1.6,
        transformOrigin: 'top center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      })
      setIfAny(contentInteractionNodes, { pointerEvents: 'auto' })
      setIfAny(stickyInteractionNodes, { autoAlpha: 1, pointerEvents: 'none' })
      setIfAny(iconNodes, { transformOrigin: 'center center' })
      setIfAny(blurDotNodes, { transformOrigin: 'center center' })
      setIfAny(sectionProgressFillNodes, { transformOrigin: 'left center', scaleX: 0 })
      gsap.set([navChromeNode, ...iconNodes, ...blurDotNodes], { willChange: 'transform, opacity' })
      setIfAny(sectionProgressFillNodes, { willChange: 'transform' })
      setIfAny(blurDotNodes, { autoAlpha: 0 })
      setIfAny(stickyProgressTrackNodes, { autoAlpha: 0 })

      const scroller = document.querySelector<HTMLElement>('body') ?? undefined
      const setInteractionMode = (isStickyMode: boolean) => {
        setIfAny(contentInteractionNodes, { pointerEvents: isStickyMode ? 'none' : 'auto' })
        setIfAny(stickyInteractionNodes, { pointerEvents: isStickyMode ? 'auto' : 'none' })
        setIfAny(stickyProgressTrackNodes, { autoAlpha: isStickyMode ? 1 : 0 })
      }
      const applyCompactDockedState = (isDocked: boolean) => {
        const hasChanged = isCompactDockedRef.current !== isDocked
        isCompactDockedRef.current = isDocked
        setInteractionMode(isDocked)
        if (isDocked) {
          if (hasChanged) {
            if (blurDotNodes.length) {
              gsap.to(blurDotNodes, {
                autoAlpha: 1,
                duration: 0.35,
                ease: uiConfig.transition.easeOutGsap,
                overwrite: 'auto',
              })
            }
          } else {
            setIfAny(blurDotNodes, { autoAlpha: 1 })
          }
        } else {
          gsap.killTweensOf(blurDotNodes, 'opacity,autoAlpha')
          gsap.to(blurDotNodes, {
            autoAlpha: 0,
            duration: 0.35,
            ease: uiConfig.transition.easeOutGsap,
            overwrite: 'auto',
          })
        }
        if (hasChanged) {
          syncSlideshowActive()
        }
      }
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-pin')?.kill()
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-trigger')?.kill()
      sectionIds.forEach((id) => {
        ScrollTrigger.getById(`intro-usp-hero-section-progress-${id}`)?.kill()
      })

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
            applyCompactDockedState(false)
          },
          onEnterBack: () => {
            applyCompactDockedState(false)
          },
          onLeave: () => {
            applyCompactDockedState(true)
          },
          onLeaveBack: () => {
            applyCompactDockedState(false)
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
          scale: 0.48,
          y: -20,
          duration: 1,
        },
        0,
      )
      const sectionProgressTriggers: ScrollTrigger[] = []
      setSectionActive(null)
      orderedSectionEntries.forEach(({ id, node }, index) => {
        const nextEntry = orderedSectionEntries[index + 1]
        const previousEntry = orderedSectionEntries[index - 1]

        const sectionTrigger = ScrollTrigger.create({
          id: `intro-usp-hero-section-progress-${id}`,
          trigger: node,
          endTrigger: nextEntry?.node,
          scroller,
          start: 'top center',
          end: nextEntry ? 'top center' : 'max',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            setSectionProgress(id, self.progress)
            if (self.isActive) {
              setSectionActive(id)
            }
          },
          onLeave: () => {
            setSectionProgress(id, 1)
            setSectionActive(nextEntry?.id ?? id)
          },
          onLeaveBack: () => {
            setSectionProgress(id, 0)
            setSectionActive(previousEntry?.id ?? null)
          },
          onEnterBack: () => {
            setSectionActive(id)
          },
        })

        sectionProgressTriggers.push(sectionTrigger)
        setSectionProgress(id, sectionTrigger.progress)
        if (sectionTrigger.isActive) {
          setSectionActive(id)
        }
      })

      slideshowInViewRef.current = true
      applyCompactDockedState((compactTimeline.scrollTrigger?.progress ?? 0) >= 0.999)

      return () => {
        sectionProgressTriggers.forEach((trigger) => {
          trigger.kill()
        })
        setSectionActive(null)
        setInteractionMode(false)
        slideshowInViewRef.current = false
        isCompactDockedRef.current = false
        setSlideshowActive(false)
      }
    },
    { dependencies: [setSectionActive, setSlideshowActive, syncSlideshowActive] },
  )

  return {
    setSlideshowActive,
    rootRef,
  }
}

export default useUspHero
