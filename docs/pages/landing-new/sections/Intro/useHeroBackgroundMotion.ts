import { type RefObject, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { IntroBlobColor } from './intro.types'

interface HeroBackgroundMotionRefs {
  motionContainerRef: RefObject<HTMLDivElement | null>
  targetColor: IntroBlobColor
  isActive: boolean
}

interface Point {
  x: number
  y: number
}

interface MotionController {
  setActive: (active: boolean) => void
}

const phaseOffsets = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3] as const

const motionConfig = {
  transition: {
    duration: 0.48,
    ease: 'power2.inOut',
    revealDuration: 0.9,
  },
  hiddenScale: 0.2,
  visibleScale: 0.4,
  orbitRadiusRatio: {
    x: 0.075,
    y: 0.105,
  },
  orbitDurationSeconds: 9.5,
  fallbackAnchors: {
    blue: { xRatio: 0.5, yRatio: 0.44 },
    green: { xRatio: 0.5, yRatio: 0.44 },
    orange: { xRatio: 0.5, yRatio: 0.44 },
  } as Record<IntroBlobColor, { xRatio: number; yRatio: number }>,
} as const

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress

const useHeroBackgroundMotion = ({ motionContainerRef, targetColor, isActive }: HeroBackgroundMotionRefs) => {
  const motionControllerRef = useRef<MotionController | null>(null)

  useGSAP(
    () => {
      if (typeof window === 'undefined') {
        return
      }

      const motionContainer = motionContainerRef.current
      if (!motionContainer) {
        return
      }

      const sectionRoot = motionContainer.closest<HTMLElement>('[data-intro-section-root="true"]')
      const queryScope: Document | HTMLElement = sectionRoot ?? document
      const blobLayer = motionContainer.querySelector<HTMLElement>('[data-blob-layer="true"]')
      const blobNodes = Array.from(motionContainer.querySelectorAll<HTMLDivElement>('[data-orbit-blob="true"]'))
      if (!blobNodes.length) {
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const getContainerRect = () => motionContainer.getBoundingClientRect()
      const getFallbackAnchor = (): Point => {
        const fallback = motionConfig.fallbackAnchors[targetColor]
        const containerRect = getContainerRect()
        return {
          x: containerRect.width * fallback.xRatio,
          y: containerRect.height * fallback.yRatio,
        }
      }

      const getAnchorPoint = (): Point => {
        const uspNode = queryScope.querySelector<HTMLElement>(`[data-usp-color="${targetColor}"]`)
        if (!uspNode) {
          return getFallbackAnchor()
        }

        const containerRect = getContainerRect()
        const rect = uspNode.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        }
      }

      const anchorState = getAnchorPoint()
      const orbitState = { phase: 0 }
      const revealState = { progress: isActive ? 1 : 0 }

      let revealTween: gsap.core.Tween | null = null
      let orbitTween: gsap.core.Tween | null = null
      let layerRevealTween: gsap.core.Tween | null = null

      const killRevealTween = () => {
        revealTween?.kill()
        revealTween = null
      }

      const killLayerRevealTween = () => {
        layerRevealTween?.kill()
        layerRevealTween = null
      }

      const updateLayout = () => {
        const containerRect = getContainerRect()
        const containerCenterX = containerRect.width * 0.5
        const containerCenterY = containerRect.height * 0.5
        const revealProgress = revealState.progress
        const radiusX = containerRect.width * motionConfig.orbitRadiusRatio.x * revealProgress
        const radiusY = containerRect.height * motionConfig.orbitRadiusRatio.y * revealProgress
        const scale = lerp(motionConfig.hiddenScale, motionConfig.visibleScale, revealProgress)

        blobNodes.forEach((blobNode, index) => {
          const phaseOffset = phaseOffsets[index] ?? 0
          const x = anchorState.x + Math.cos(orbitState.phase + phaseOffset) * radiusX
          const y = anchorState.y + Math.sin(orbitState.phase + phaseOffset) * radiusY

          gsap.set(blobNode, {
            x: x - containerCenterX,
            y: y - containerCenterY,
            scale,
            opacity: revealProgress,
          })
        })
      }

      const refreshAnchor = () => {
        const nextPoint = getAnchorPoint()
        anchorState.x = nextPoint.x
        anchorState.y = nextPoint.y
        updateLayout()
      }

      const setActive = (nextActive: boolean, immediate = false) => {
        const shouldAnimate = !prefersReducedMotion && !immediate
        killRevealTween()

        if (!prefersReducedMotion && nextActive) {
          orbitTween?.resume()
        }

        revealTween = gsap.to(revealState, {
          progress: nextActive ? 1 : 0,
          duration: shouldAnimate ? motionConfig.transition.duration : 0,
          ease: shouldAnimate ? motionConfig.transition.ease : 'none',
          overwrite: 'auto',
          onUpdate: updateLayout,
          onComplete: () => {
            if (nextActive) {
              return
            }
            orbitTween?.pause()
          },
        })
      }

      gsap.set(blobNodes, {
        force3D: true,
        transformOrigin: 'center center',
        opacity: 0,
        scale: motionConfig.hiddenScale,
      })

      if (blobLayer) {
        gsap.set(blobLayer, { autoAlpha: 0 })
        layerRevealTween = gsap.to(blobLayer, {
          autoAlpha: 1,
          duration: motionConfig.transition.revealDuration,
          ease: motionConfig.transition.ease,
          overwrite: 'auto',
        })
      }

      if (!prefersReducedMotion) {
        orbitTween = gsap.to(orbitState, {
          phase: `+=${Math.PI * 2}`,
          duration: motionConfig.orbitDurationSeconds,
          ease: 'none',
          repeat: -1,
          paused: !isActive,
          onUpdate: updateLayout,
        })
      }

      const onResize = () => {
        refreshAnchor()
      }

      window.addEventListener('resize', onResize)

      refreshAnchor()
      setActive(isActive, true)
      updateLayout()
      motionControllerRef.current = { setActive }

      return () => {
        motionControllerRef.current = null
        window.removeEventListener('resize', onResize)
        killRevealTween()
        killLayerRevealTween()
        orbitTween?.kill()
      }
    },
    { dependencies: [targetColor] },
  )

  useEffect(() => {
    motionControllerRef.current?.setActive(isActive)
  }, [isActive])
}

export default useHeroBackgroundMotion
