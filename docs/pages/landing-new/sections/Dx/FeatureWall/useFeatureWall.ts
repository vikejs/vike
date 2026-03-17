import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

import useMotionAllowed from '../../../hooks/useMotionAllowed'

interface UseFeatureWallOptions {
  pixelsPerSecond?: number
  rowSpeedFactors?: number[]
}

const defaultRowSpeedFactors = [1, 0.92, 1.08]

const useFeatureWall = ({
  pixelsPerSecond = 36,
  rowSpeedFactors = defaultRowSpeedFactors,
}: UseFeatureWallOptions = {}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const interactivelyPausedRef = useRef(false)
  const isMotionAllowed = useMotionAllowed()

  const killTweens = () => {
    tweensRef.current.forEach((tween) => tween.kill())
    tweensRef.current = []
  }

  const pause = () => {
    interactivelyPausedRef.current = true
    tweensRef.current.forEach((tween) => tween.pause())
  }

  const resume = () => {
    interactivelyPausedRef.current = false
    if (!isMotionAllowed) {
      return
    }
    tweensRef.current.forEach((tween) => tween.play())
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
        tracks.forEach((track) => {
          gsap.set(track, { clearProps: 'transform,willChange' })
        })
        return
      }

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
            repeat: -1,
          })

          if (interactivelyPausedRef.current) {
            tween.pause()
          }

          tweensRef.current.push(tween)
        })
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

      const resizeObserver = new ResizeObserver(() => {
        requestBuild()
      })

      resizeObserver.observe(root)
      sequences.forEach((sequence) => resizeObserver.observe(sequence))

      return () => {
        if (rebuildFrame) {
          window.cancelAnimationFrame(rebuildFrame)
        }
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
