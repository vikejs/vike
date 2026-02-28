import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { registerScrollToPlugin, registerScrollTrigger } from '../../../util/gsap.utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import { uiConfig } from '../../../util/ui.constants'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

const useUspHero = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const isCompactDockedRef = useRef(false)

  useGSAP(
    () => {
      const rootNode = rootRef.current
      if (!rootNode || typeof document === 'undefined') {
        return
      }

      registerScrollTrigger()
      registerScrollToPlugin()

      const navNode = rootNode.querySelector<HTMLElement>('[data-usp-hero-nav="true"]')
      const navChromeNode = rootNode.querySelector<HTMLElement>('[data-usp-hero-nav-chrome="true"]')
      const contentInteractionNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-content-hit="true"]'),
      )
      const stickyInteractionNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-hit="true"]'))
      const iconNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-icon="true"]'))
      const blurDotNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-dot]'))
      const stickyLogoNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-logo="true"]'))
      const sectionProgressFillNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-progress-fill]'),
      )
      const stickyProgressTrackNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-progress-track]'),
      )

      if (!navNode || !navChromeNode || !contentInteractionNodes.length || !stickyInteractionNodes.length) {
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
      const scrollToSectionById = (id: UspId) => {
        if (typeof window === 'undefined') {
          return
        }
        const sectionNode = sectionNodesById.get(id)
        if (!sectionNode) {
          return
        }
        const sectionTop = sectionNode.getBoundingClientRect().top + window.scrollY
        const top = Math.max(sectionTop - 96, 0)
        gsap.to(window, {
          duration: uiConfig.transition.longDuration,
          ease: uiConfig.transition.easeInOutGsap,
          overwrite: 'auto',
          scrollTo: {
            y: top,
            autoKill: true,
          },
        })
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
      })
      setIfAny(contentInteractionNodes, { pointerEvents: 'auto' })
      setIfAny(stickyInteractionNodes, { autoAlpha: 1, pointerEvents: 'none' })
      setIfAny(iconNodes, { transformOrigin: 'center center' })
      setIfAny(blurDotNodes, { transformOrigin: 'center center' })
      setIfAny(sectionProgressFillNodes, { transformOrigin: 'left center', scaleX: 0 })
      gsap.set([navChromeNode, ...iconNodes, ...blurDotNodes], { willChange: 'transform, opacity' })
      setIfAny(sectionProgressFillNodes, { willChange: 'transform' })
      setIfAny(stickyLogoNodes, { willChange: 'opacity' })
      setIfAny(blurDotNodes, { autoAlpha: 0 })
      setIfAny(stickyProgressTrackNodes, { autoAlpha: 0 })
      setIfAny(stickyLogoNodes, { autoAlpha: 0, x: 16 })

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
            if (stickyLogoNodes.length) {
              gsap.to(stickyLogoNodes, {
                autoAlpha: 1,
                x: 0,
                duration: uiConfig.transition.shortDuration,
                ease: uiConfig.transition.easeOutGsap,
                overwrite: 'auto',
              })
            }
          } else {
            setIfAny(blurDotNodes, { autoAlpha: 1 })
            setIfAny(stickyLogoNodes, { autoAlpha: 1 })
          }
        } else {
          gsap.killTweensOf(blurDotNodes, 'opacity,autoAlpha')
          gsap.to(blurDotNodes, {
            autoAlpha: 0,
            duration: 0.35,
            ease: uiConfig.transition.easeOutGsap,
            overwrite: 'auto',
          })
          gsap.killTweensOf(stickyLogoNodes, 'opacity,autoAlpha')
          if (hasChanged) {
            if (stickyLogoNodes.length) {
              gsap.to(stickyLogoNodes, {
                autoAlpha: 0,
                x: 16,
                duration: uiConfig.transition.shortDuration,
                ease: uiConfig.transition.easeOutGsap,
                overwrite: 'auto',
              })
            }
          } else {
            setIfAny(stickyLogoNodes, { autoAlpha: 0 })
          }
        }
      }
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-pin')?.kill()
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-trigger')?.kill()
      sectionIds.forEach((id) => {
        ScrollTrigger.getById(`intro-usp-hero-section-progress-${id}`)?.kill()
      })

      const stickyClickListeners: Array<{ node: HTMLElement; handler: () => void }> = []
      stickyInteractionNodes.forEach((node) => {
        const id = node.dataset.uspId
        if (!id) {
          return
        }
        const handler = () => {
          scrollToSectionById(id as UspId)
        }
        node.addEventListener('click', handler)
        stickyClickListeners.push({ node, handler })
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
      orderedSectionEntries.forEach(({ id, node }, index) => {
        const nextEntry = orderedSectionEntries[index + 1]

        const sectionTrigger = ScrollTrigger.create({
          id: `intro-usp-hero-section-progress-${id}`,
          trigger: node,
          endTrigger: nextEntry?.node,
          scroller,
          start: 'top 10%',
          end: nextEntry ? 'top top' : 'max',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            setSectionProgress(id, self.progress)
          },
          onLeave: () => {
            setSectionProgress(id, 1)
          },
          onLeaveBack: () => {
            setSectionProgress(id, 0)
          },
        })

        sectionProgressTriggers.push(sectionTrigger)
        setSectionProgress(id, sectionTrigger.progress)
      })

      applyCompactDockedState((compactTimeline.scrollTrigger?.progress ?? 0) >= 0.999)

      return () => {
        stickyClickListeners.forEach(({ node, handler }) => {
          node.removeEventListener('click', handler)
        })
        sectionProgressTriggers.forEach((trigger) => {
          trigger.kill()
        })
        setInteractionMode(false)
        isCompactDockedRef.current = false
      }
    },
    { dependencies: [] },
  )

  return {
    rootRef,
  }
}

export default useUspHero
