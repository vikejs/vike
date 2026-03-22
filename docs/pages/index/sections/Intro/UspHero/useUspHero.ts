import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import {
  registerScrollToPlugin,
  registerScrollTrigger,
  smoothScrollToTarget,
  stickyNavOffset,
} from '../../../util/gsap.utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import { uiConfig } from '../../../util/ui.constants'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const activeSectionViewportRatio = 0.5

const useUspHero = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const isCompactDockedRef = useRef(false)
  const activeSectionIdRef = useRef<UspId | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<UspId | null>(null)
  const [isCompactDocked, setIsCompactDocked] = useState(false)

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
      const heroInteractionNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-hero-interaction="true"]'),
      )
      const stickyInteractionNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-hit="true"]'))
      const stickyExtraHitboxNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-extra-hitbox="true"]'),
      )
      const iconNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-icon="true"]'))
      const blurDotNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-dot]'))
      const stickyLogoNodes = Array.from(rootNode.querySelectorAll<HTMLElement>('[data-usp-sticky-logo="true"]'))
      const sectionProgressFillNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>('[data-usp-scroll-progress-fill]'),
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
      const syncActiveSectionId = (nextActiveSectionId: UspId | null) => {
        if (activeSectionIdRef.current === nextActiveSectionId) {
          return
        }
        activeSectionIdRef.current = nextActiveSectionId
        setActiveSectionId(nextActiveSectionId)
      }
      const resolveActiveSectionId = () => {
        if (typeof window === 'undefined' || !orderedSectionEntries.length) {
          syncActiveSectionId(null)
          return
        }

        const viewportProbeOffset = Math.max(window.innerHeight * activeSectionViewportRatio, stickyNavOffset + 1)
        const viewportProbe = window.scrollY + viewportProbeOffset
        let nextActiveSectionId: UspId | null = null

        orderedSectionEntries.forEach(({ id, node }) => {
          const sectionTop = node.getBoundingClientRect().top + window.scrollY
          if (sectionTop <= viewportProbe) {
            nextActiveSectionId = id
          }
        })

        syncActiveSectionId(nextActiveSectionId)
      }

      const setSectionProgress = (id: string, progress: number) => {
        const clampedProgress = clamp01(progress)

        const sectionFillNode = sectionProgressFillById.get(id)
        if (sectionFillNode) {
          gsap.set(sectionFillNode, { scaleX: clampedProgress })
        }
      }
      const scrollToSectionById = (id: UspId) => {
        const sectionNode = sectionNodesById.get(id)
        if (!sectionNode) {
          return
        }
        smoothScrollToTarget(sectionNode)
      }
      const scrollToTop = () => {
        if (typeof window === 'undefined') {
          return
        }
        gsap.to(window, {
          duration: uiConfig.transition.longDuration,
          ease: uiConfig.transition.easeInOutGsap,
          overwrite: 'auto',
          scrollTo: {
            y: 0,
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
      setIfAny(heroInteractionNodes, { pointerEvents: 'auto' })
      setIfAny(stickyInteractionNodes, { autoAlpha: 1, pointerEvents: 'none' })
      setIfAny(stickyExtraHitboxNodes, { pointerEvents: 'none' })
      setIfAny(iconNodes, { transformOrigin: 'center center' })
      setIfAny(blurDotNodes, { transformOrigin: 'center center' })
      setIfAny(sectionProgressFillNodes, { transformOrigin: 'left center', scaleX: 0 })
      gsap.set([navChromeNode, ...iconNodes, ...blurDotNodes], { willChange: 'transform, opacity' })
      setIfAny(sectionProgressFillNodes, { willChange: 'transform' })
      setIfAny(stickyLogoNodes, { willChange: 'opacity' })
      setIfAny(stickyExtraHitboxNodes, { willChange: 'opacity' })
      setIfAny(blurDotNodes, { autoAlpha: 0 })
      setIfAny(stickyLogoNodes, { autoAlpha: 0, x: 16 })
      setIfAny(stickyExtraHitboxNodes, { autoAlpha: 0, xPercent: 5 })

      const scroller = document.querySelector<HTMLElement>('body') ?? undefined
      const setInteractionMode = (isStickyMode: boolean) => {
        setIfAny(contentInteractionNodes, { pointerEvents: isStickyMode ? 'none' : 'auto' })
        setIfAny(heroInteractionNodes, { pointerEvents: isStickyMode ? 'none' : 'auto' })
        setIfAny(stickyInteractionNodes, { pointerEvents: isStickyMode ? 'auto' : 'none' })
        setIfAny(stickyExtraHitboxNodes, { pointerEvents: isStickyMode ? 'auto' : 'none' })
        setIfAny(stickyLogoNodes, { pointerEvents: isStickyMode ? 'auto' : 'none' })
      }
      const applyCompactDockedState = (isDocked: boolean) => {
        const hasChanged = isCompactDockedRef.current !== isDocked
        isCompactDockedRef.current = isDocked
        if (hasChanged) {
          setIsCompactDocked(isDocked)
        }
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
            if (stickyExtraHitboxNodes.length) {
              gsap.to(stickyExtraHitboxNodes, {
                autoAlpha: 1,
                stagger: 0.05,
                xPercent: 0,
                duration: uiConfig.transition.shortDuration,
                ease: uiConfig.transition.easeOutGsap,
                overwrite: 'auto',
              })
            }
          } else {
            setIfAny(blurDotNodes, { autoAlpha: 1 })
            setIfAny(stickyLogoNodes, { autoAlpha: 1 })
            setIfAny(stickyExtraHitboxNodes, { autoAlpha: 1, xPercent: 0 })
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
          gsap.killTweensOf(stickyExtraHitboxNodes, 'opacity,autoAlpha')
          if (hasChanged) {
            if (stickyExtraHitboxNodes.length) {
              gsap.to(stickyExtraHitboxNodes, {
                autoAlpha: 0,
                xPercent: 5,
                duration: uiConfig.transition.shortDuration,
                ease: uiConfig.transition.easeOutGsap,
                overwrite: 'auto',
              })
            }
          } else {
            setIfAny(stickyExtraHitboxNodes, { autoAlpha: 0 })
          }
        }
      }
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-pin')?.kill()
      ScrollTrigger.getById('intro-usp-hero-sticky-nav-trigger')?.kill()
      sectionIds.forEach((id) => {
        ScrollTrigger.getById(`intro-usp-hero-section-progress-${id}`)?.kill()
      })

      const stickyClickListeners: Array<{ node: HTMLElement; handler: () => void }> = []
      ;[...stickyInteractionNodes, ...stickyExtraHitboxNodes].forEach((node) => {
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
      const heroClickListeners: Array<{ node: HTMLElement; handler: () => void }> = []
      heroInteractionNodes.forEach((node) => {
        const id = node.dataset.uspId
        if (!id) {
          return
        }
        const handler = () => {
          scrollToSectionById(id as UspId)
        }
        node.addEventListener('click', handler)
        heroClickListeners.push({ node, handler })
      })
      const logoClickListeners: Array<{ node: HTMLElement; handler: () => void }> = []
      stickyLogoNodes.forEach((node) => {
        const handler = () => {
          scrollToTop()
        }
        node.addEventListener('click', handler)
        logoClickListeners.push({ node, handler })
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
            resolveActiveSectionId()
          },
          onLeaveBack: () => {
            applyCompactDockedState(false)
            resolveActiveSectionId()
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
          scale: 0.6,
          y: -14,
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
            resolveActiveSectionId()
          },
          onEnter: () => {
            resolveActiveSectionId()
          },
          onEnterBack: () => {
            resolveActiveSectionId()
          },
          onLeave: () => {
            setSectionProgress(id, 1)
            resolveActiveSectionId()
          },
          onLeaveBack: () => {
            setSectionProgress(id, 0)
            resolveActiveSectionId()
          },
        })

        sectionProgressTriggers.push(sectionTrigger)
        setSectionProgress(id, sectionTrigger.progress)
      })

      resolveActiveSectionId()
      applyCompactDockedState((compactTimeline.scrollTrigger?.progress ?? 0) >= 0.999)

      return () => {
        stickyClickListeners.forEach(({ node, handler }) => {
          node.removeEventListener('click', handler)
        })
        heroClickListeners.forEach(({ node, handler }) => {
          node.removeEventListener('click', handler)
        })
        logoClickListeners.forEach(({ node, handler }) => {
          node.removeEventListener('click', handler)
        })
        sectionProgressTriggers.forEach((trigger) => {
          trigger.kill()
        })
        setInteractionMode(false)
        isCompactDockedRef.current = false
        activeSectionIdRef.current = null
      }
    },
    { dependencies: [] },
  )

  return {
    activeSectionId,
    isCompactDocked,
    rootRef,
  }
}

export default useUspHero
