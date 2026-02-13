import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

const FADE_DURATION = 0.6
const HOLD_DURATION = 0.5

let scrollSmootherRegistered = false
let scrollTriggerRegistered = false

const registerScrollSmoother = () => {
  if (scrollSmootherRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollSmoother)
  scrollSmootherRegistered = true
}

const registerScrollTrigger = () => {
  if (scrollTriggerRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

const getSpeedValue = (element: Element) => {
  const speedAttr = element.getAttribute('data-speed')
  if (!speedAttr) {
    return null
  }

  const matches = speedAttr.match(/-?\d*\.?\d+/g)
  if (!matches || !matches.length) {
    return null
  }

  const speedValue = Number(matches[0])
  return Number.isFinite(speedValue) ? speedValue : null
}

const useScrollSmoother = () => {
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useGSAP(
    () => {
      if (typeof window === 'undefined') {
        return
      }

      registerScrollSmoother()
      registerScrollTrigger()

      const wrapper = document.querySelector<HTMLElement>('#smooth-wrapper')
      const content = document.querySelector<HTMLElement>('#smooth-content')
      if (!wrapper || !content) {
        return
      }

      smootherRef.current?.kill()
      smootherRef.current = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 0,
        smoothTouch: 0,
        effects: true,
      })

      const fadeTimelines: gsap.core.Timeline[] = []
      const speedTargets = Array.from(content.querySelectorAll<HTMLElement>('[data-speed]'))
      speedTargets.forEach((target) => {
        const speedValue = getSpeedValue(target)
        if (speedValue === null || speedValue >= 1) {
          return
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: target,
            scroller: wrapper,
            start: 'top 90%',
            end: 'bottom 10%',
            markers: false,
            scrub: true,
            invalidateOnRefresh: false,
          },
        })

        gsap.set(target, { transformOrigin: 'center bottom' })

        timeline
          .fromTo(target, { opacity: 0 }, { opacity: 1, duration: FADE_DURATION, ease: 'none' })
          .to(target, { opacity: 1, duration: HOLD_DURATION, ease: 'none' })
          .to(target, { opacity: 0, duration: FADE_DURATION, ease: 'none' })

        fadeTimelines.push(timeline)
      })

      return () => {
        fadeTimelines.forEach((timeline) => {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        })
        smootherRef.current?.kill()
        smootherRef.current = null
      }
    },
    { dependencies: [] },
  )
}

export default useScrollSmoother
