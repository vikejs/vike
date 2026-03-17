import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useMotionAllowed from '../../../hooks/useMotionAllowed'
import { registerScrollTrigger } from '../../../util/gsap.utils'

interface UseFeatureWallOptions {
  pixelsPerSecond?: number
  rowSpeedFactors?: number[]
}

const defaultRowSpeedFactors = [1, 0.92, 1.08]

const useFeatureWall = ({
  pixelsPerSecond = 40,
  rowSpeedFactors = defaultRowSpeedFactors,
}: UseFeatureWallOptions = {}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const isInViewRef = useRef(false)
  const interactivelyPausedRef = useRef(false)
  const isMotionAllowed = useMotionAllowed()

  const killTweens = () => {
    tweensRef.current.forEach((tween) => tween.kill())
    tweensRef.current = []
  }

  const syncPlayback = () => {
    const shouldPlay = isMotionAllowed && isInViewRef.current && !interactivelyPausedRef.current

    tweensRef.current.forEach((tween) => {
      if (shouldPlay) {
        tween.play()
      } else {
        tween.pause()
      }
    })
  }

  const pause = () => {
    interactivelyPausedRef.current = true
    syncPlayback()
  }

  const resume = () => {
    interactivelyPausedRef.current = false
    syncPlayback()
  }

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) {
        return
      }

      const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-feature-wall-track]'))
      const sequences = tracks
        .map((track) => track.querySelector<HTMLElement>('[data-feature-wall-sequence]'))
        .filter((sequence): sequence is HTMLElement => sequence !== null)

      killTweens()

      if (!tracks.length || !isMotionAllowed) {
        isInViewRef.current = false
        tracks.forEach((track) => {
          gsap.set(track, { clearProps: 'transform,willChange' })
        })
        return
      }

      registerScrollTrigger()

      const scroller =
        typeof document === 'undefined' ? undefined : (document.querySelector<HTMLElement>('body') ?? undefined)
      const viewTrigger = ScrollTrigger.create({
        trigger: root,
        scroller,
        start: 'top bottom',
        end: 'bottom top',
        markers: false,
        onEnter: () => {
          isInViewRef.current = true
          syncPlayback()
        },
        onEnterBack: () => {
          isInViewRef.current = true
          syncPlayback()
        },
        onLeave: () => {
          isInViewRef.current = false
          syncPlayback()
        },
        onLeaveBack: () => {
          isInViewRef.current = false
          syncPlayback()
        },
      })

      const build = () => {
        killTweens()

        tracks.forEach((track, index) => {
          const firstSequence = track.querySelector<HTMLElement>('[data-feature-wall-sequence]')
          const distance = firstSequence?.offsetWidth ?? 0

          if (!distance) {
            gsap.set(track, { clearProps: 'transform,willChange' })
            return
          }

          const speedFactor = Number(track.dataset.speedMultiplier ?? rowSpeedFactors[index] ?? 1)
          const duration = distance / (pixelsPerSecond * speedFactor)

          gsap.set(track, { x: 0, willChange: 'transform' })

          const tween = gsap.to(track, {
            x: -distance,
            duration,
            ease: 'none',
            paused: true,
            repeat: -1,
          })

          tweensRef.current.push(tween)
        })

        syncPlayback()
      }

      let rebuildFrame = 0
      const requestBuild = () => {
        if (rebuildFrame) {
          window.cancelAnimationFrame(rebuildFrame)
        }
        rebuildFrame = window.requestAnimationFrame(() => {
          rebuildFrame = 0
          build()
        })
      }

      build()
      isInViewRef.current = viewTrigger.isActive
      syncPlayback()

      const resizeObserver = new ResizeObserver(() => {
        requestBuild()
      })

      resizeObserver.observe(root)
      sequences.forEach((sequence) => resizeObserver.observe(sequence))

      return () => {
        if (rebuildFrame) {
          window.cancelAnimationFrame(rebuildFrame)
        }
        viewTrigger.kill()
        isInViewRef.current = false
        resizeObserver.disconnect()
        killTweens()
        tracks.forEach((track) => {
          gsap.set(track, { clearProps: 'transform,willChange' })
        })
      }
    },
    { scope: rootRef, dependencies: [isMotionAllowed, pixelsPerSecond, rowSpeedFactors.join(',')] },
  )

  return {
    rootRef,
    pause,
    resume,
  }
}

export default useFeatureWall
