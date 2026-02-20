import { type RefObject, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { R } from '../../util/gsap.utils'
import { UiColorVariantKey } from '../../util/ui.constants'

interface HeroBackgroundMotionRefs {
  motionContainerRef: RefObject<HTMLDivElement | null>
  targetColor: UiColorVariantKey
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
  hiddenScale: 0.1,
  visibleScale: 0.29,
  orbitRadiusRatio: {
    x: 0.065,
    y: 0.075,
  },
  orbitDurationSeconds: 9.5,
  hoverOpacity: {
    min: 0.16,
    max: 0.2,
    durationSeconds: {
      min: 0.95,
      max: 2.25,
    },
  },
  fallbackAnchors: {
    blue: { xRatio: 0.5, yRatio: 0.44 },
    green: { xRatio: 0.5, yRatio: 0.44 },
    orange: { xRatio: 0.5, yRatio: 0.44 },
  } as Record<UiColorVariantKey, { xRatio: number; yRatio: number }>,
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
      const blobOpacityStates = blobNodes.map(() => ({ value: 1 }))

      let revealTween: gsap.core.Tween | null = null
      let orbitTween: gsap.core.Tween | null = null
      let layerRevealTween: gsap.core.Tween | null = null
      let opacityTweens: gsap.core.Tween[] = []

      const killRevealTween = () => {
        revealTween?.kill()
        revealTween = null
      }

      const killLayerRevealTween = () => {
        layerRevealTween?.kill()
        layerRevealTween = null
      }

      const killOpacityTweens = () => {
        opacityTweens.forEach((tween) => tween.kill())
        opacityTweens = []
      }

      const startOpacityDrift = () => {
        if (prefersReducedMotion) {
          return
        }

        killOpacityTweens()
        const { min, max } = motionConfig.hoverOpacity
        const duration = motionConfig.hoverOpacity.durationSeconds
        blobOpacityStates.forEach((state) => {
          state.value = R(min, max)
        })
        updateLayout()
        opacityTweens = blobOpacityStates.map((state) =>
          gsap.to(state, {
            value: () => R(min, max),
            duration: () => R(duration.min, duration.max),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            overwrite: 'auto',
            onUpdate: updateLayout,
          }),
        )
      }

      const resetOpacityDrift = () => {
        killOpacityTweens()
        blobOpacityStates.forEach((state) => {
          state.value = 1
        })
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
            opacity: revealProgress * (blobOpacityStates[index]?.value ?? 1),
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
          startOpacityDrift()
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
            resetOpacityDrift()
            updateLayout()
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
        killOpacityTweens()
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
