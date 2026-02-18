import { type RefObject, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { R } from '../../util/gsap.utils'
import type { IntroBlobColor, UspHoverTarget } from './intro.types'

interface HeroBackgroundMotionRefs {
  motionContainerRef: RefObject<HTMLDivElement | null>
  hoveredUspTarget: UspHoverTarget | null
}

interface Point {
  x: number
  y: number
}

type BlobLayerMap = Record<IntroBlobColor, HTMLImageElement>

type MotionMode = 'idle' | 'hover'

interface BlobConfig {
  target: HTMLDivElement
  layers: BlobLayerMap
  defaultColor: IntroBlobColor
  phaseOffset: number
}

interface MotionController {
  setHoverTarget: (hoverTarget: UspHoverTarget | null) => void
}

const blobColors: IntroBlobColor[] = ['blue', 'green', 'orange']
const containerCenterRatio = {
  x: 0.5,
  y: 0.44,
} as const

const motionConfig = {
  transition: {
    duration: 0.62,
    ease: 'power3.inOut',
    revealDuration: 0.8,
  },
  idle: {
    yOffsetPx: -70,
    blobScale: 0.24,
    opacity: {
      value: 0.45,
    },
    fallbackAnchors: {
      blue: { xRatio: 0.72, yRatio: 0.8 },
      green: { xRatio: 0.28, yRatio: 0.8 },
      orange: { xRatio: 0.5, yRatio: 0.9 },
    } as Record<IntroBlobColor, { xRatio: number; yRatio: number }>,
  },
  hover: {
    blobScale: 0.27,
    orbitRadiusRatio: {
      x: 0.06,
      y: 0.12,
    },
    orbitDurationSeconds: 10,
    opacity: {
      layerRange: {
        min: 0.9,
        max: 1,
      },
      pulse: {
        min: 0.36,
        fadeOutDuration: 0.2,
        holdDuration: 0.18,
        fadeInDuration: 0.28,
      },
      durationSeconds: { min: 1, max: 2.4 },
    },
  },
} as const

let scrollTriggerRegistered = false

const registerScrollTrigger = () => {
  if (scrollTriggerRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

const isBlobColor = (color: string | null): color is IntroBlobColor => {
  return color === 'blue' || color === 'green' || color === 'orange'
}

const collectBlobLayers = (blobNode: HTMLDivElement): BlobLayerMap | null => {
  const layerMap: Partial<BlobLayerMap> = {}
  const layerNodes = Array.from(blobNode.querySelectorAll<HTMLImageElement>('[data-blob-color]'))

  layerNodes.forEach((node) => {
    const color = node.getAttribute('data-blob-color')
    if (!isBlobColor(color)) {
      return
    }
    layerMap[color] = node
  })

  if (!layerMap.blue || !layerMap.green || !layerMap.orange) {
    return null
  }

  return layerMap as BlobLayerMap
}

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress

const useHeroBackgroundMotion = ({ motionContainerRef, hoveredUspTarget }: HeroBackgroundMotionRefs) => {
  const motionControllerRef = useRef<MotionController | null>(null)

  useGSAP(
    () => {
      if (typeof window === 'undefined') {
        return
      }

      registerScrollTrigger()

      const motionContainer = motionContainerRef.current
      if (!motionContainer) {
        return
      }

      const sectionRoot = motionContainer.closest<HTMLElement>('[data-intro-section-root="true"]')
      const queryScope: Document | HTMLElement = sectionRoot ?? document
      const blobLayer = motionContainer.querySelector<HTMLElement>('[data-blob-layer="true"]')
      const blobOpacityLayer = motionContainer.querySelector<HTMLElement>('[data-blob-opacity-layer="true"]')

      const blobNodes = Array.from(motionContainer.querySelectorAll<HTMLDivElement>('[data-orbit-blob="true"]'))
      if (!blobNodes.length) {
        return
      }

      const getContainerRect = () => motionContainer.getBoundingClientRect()
      const getContainerCenter = (): Point => {
        const containerRect = getContainerRect()
        return {
          x: containerRect.width * containerCenterRatio.x,
          y: containerRect.height * containerCenterRatio.y,
        }
      }
      const viewportToContainerPoint = (point: Point): Point => {
        const containerRect = getContainerRect()
        return {
          x: point.x - containerRect.left,
          y: point.y - containerRect.top,
        }
      }

      const idleAnchors: Record<IntroBlobColor, Point> = {
        blue: getContainerCenter(),
        green: getContainerCenter(),
        orange: getContainerCenter(),
      }

      const modeState = {
        progress: hoveredUspTarget ? 1 : 0,
      }
      const modeFlags = {
        isHoverMode: Boolean(hoveredUspTarget),
      }
      const orbitState = { phase: 0 }
      const hoverCenterState = hoveredUspTarget ? viewportToContainerPoint(hoveredUspTarget) : getContainerCenter()

      const blobBlueprint = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]

      const blobs: BlobConfig[] = blobNodes
        .map((blobNode, index) => {
          const defaultColorAttr = blobNode.getAttribute('data-default-color')
          if (!isBlobColor(defaultColorAttr)) {
            return null
          }

          const phaseOffset = blobBlueprint[index]
          if (phaseOffset === undefined) {
            return null
          }

          const layers = collectBlobLayers(blobNode)
          if (!layers) {
            return null
          }

          return {
            target: blobNode,
            defaultColor: defaultColorAttr,
            phaseOffset,
            layers,
          }
        })
        .filter((blob): blob is BlobConfig => blob !== null)

      if (!blobs.length) {
        return
      }

      const blobImageNodes = blobs.flatMap((blob) => blobColors.map((color) => blob.layers[color]))

      let centerTween: gsap.core.Tween | null = null
      let modeTween: gsap.core.Tween | null = null
      let orbitTween: gsap.core.Tween | null = null
      let opacityTweens: gsap.core.Animation[] = []
      let colorTweens: gsap.core.Tween[] = []
      let revealTween: gsap.core.Tween | null = null
      let isDisposed = false
      let visibilityActive = true

      const killCenterTween = () => {
        centerTween?.kill()
        centerTween = null
      }

      const killModeTween = () => {
        modeTween?.kill()
        modeTween = null
      }

      const killOpacityTweens = () => {
        opacityTweens.forEach((tween) => tween.kill())
        opacityTweens = []
      }

      const killColorTweens = () => {
        colorTweens.forEach((tween) => tween.kill())
        colorTweens = []
      }
      const killRevealTween = () => {
        revealTween?.kill()
        revealTween = null
      }

      const waitForBlobImagesReady = () =>
        Promise.all(
          blobImageNodes.map(
            (imageNode) =>
              new Promise<void>((resolve) => {
                if (imageNode.complete) {
                  resolve()
                  return
                }

                const onDone = () => {
                  imageNode.removeEventListener('load', onDone)
                  imageNode.removeEventListener('error', onDone)
                  resolve()
                }
                imageNode.addEventListener('load', onDone)
                imageNode.addEventListener('error', onDone)
              }),
          ),
        ).then(() => undefined)

      const revealBlobLayerWhenReady = () => {
        if (!blobLayer) {
          return
        }

        void waitForBlobImagesReady().then(() => {
          if (isDisposed) {
            return
          }

          updateLayout()
          killRevealTween()
          revealTween = gsap.to(blobLayer, {
            autoAlpha: 1,
            duration: motionConfig.transition.revealDuration,
            ease: motionConfig.transition.ease,
            overwrite: 'auto',
          })
        })
      }

      const getIdleFallbackAnchor = (color: IntroBlobColor): Point => {
        const fallback = motionConfig.idle.fallbackAnchors[color]
        const containerRect = getContainerRect()
        return {
          x: containerRect.width * fallback.xRatio,
          y: containerRect.height * fallback.yRatio + motionConfig.idle.yOffsetPx,
        }
      }

      const refreshIdleAnchors = () => {
        const containerRect = getContainerRect()
        blobColors.forEach((color) => {
          const uspNode = queryScope.querySelector<HTMLElement>(`[data-usp-color="${color}"]`)
          if (!uspNode) {
            idleAnchors[color] = getIdleFallbackAnchor(color)
            return
          }

          const rect = uspNode.getBoundingClientRect()
          idleAnchors[color] = {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top + motionConfig.idle.yOffsetPx,
          }
        })
      }

      const updateLayout = () => {
        const containerRect = getContainerRect()
        const containerWidth = containerRect.width
        const containerHeight = containerRect.height
        const containerCenterX = containerWidth * 0.5
        const containerCenterY = containerHeight * 0.5
        const modeProgress = modeState.progress

        blobs.forEach((blob) => {
          const idleAnchor = idleAnchors[blob.defaultColor]

          const orbitX =
            hoverCenterState.x +
            Math.cos(orbitState.phase + blob.phaseOffset) * containerWidth * motionConfig.hover.orbitRadiusRatio.x
          const orbitY =
            hoverCenterState.y +
            Math.sin(orbitState.phase + blob.phaseOffset) * containerHeight * motionConfig.hover.orbitRadiusRatio.y

          const x = lerp(idleAnchor.x, orbitX, modeProgress)
          const y = lerp(idleAnchor.y, orbitY, modeProgress)
          const scale = lerp(motionConfig.idle.blobScale, motionConfig.hover.blobScale, modeProgress)

          gsap.set(blob.target, {
            x: x - containerCenterX,
            y: y - containerCenterY,
            scale,
          })
        })
      }

      const setOrbitPlayback = (play: boolean) => {
        if (!orbitTween) {
          return
        }
        if (!visibilityActive || !play) {
          orbitTween.pause()
          return
        }
        orbitTween.resume()
      }

      const createHoverOpacityLoop = () => {
        if (!blobOpacityLayer) {
          return [] as gsap.core.Animation[]
        }

        const durationRange = motionConfig.hover.opacity.durationSeconds
        const range = motionConfig.hover.opacity.layerRange

        return [
          gsap.to(blobOpacityLayer, {
            opacity: () => R(range.min, range.max),
            duration: () => R(durationRange.min, durationRange.max),
            delay: R(0.05, 0.35),
            ease: 'power2.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
          }),
        ]
      }

      const setBlobTargetsOpacity = (opacity: number, immediate = false) => {
        gsap.set(
          blobs.map((blob) => blob.target),
          { opacity },
        )
      }

      const setLayerOpacity = (opacity: number, immediate = false) => {
        if (!blobOpacityLayer) {
          return
        }
        gsap.to(blobOpacityLayer, {
          opacity,
          duration: immediate ? 0 : motionConfig.transition.duration,
          ease: immediate ? 'none' : motionConfig.transition.ease,
          overwrite: 'auto',
        })
      }

      const startLayerOpacityPulse = ({
        immediate = false,
        continueWithHoverLoop = false,
        finalOpacityWhenDone,
      }: {
        immediate?: boolean
        continueWithHoverLoop?: boolean
        finalOpacityWhenDone?: number
      }) => {
        killOpacityTweens()

        if (immediate || !blobOpacityLayer) {
          if (!continueWithHoverLoop) {
            setLayerOpacity(finalOpacityWhenDone ?? motionConfig.idle.opacity.value, true)
            return
          }
          if (continueWithHoverLoop) {
            opacityTweens = createHoverOpacityLoop()
            if (!visibilityActive) {
              opacityTweens.forEach((tween) => tween.pause())
            }
          }
          return
        }

        const pulse = motionConfig.hover.opacity.pulse
        const range = motionConfig.hover.opacity.layerRange
        const finalOpacity = continueWithHoverLoop ? R(range.min, range.max) : (finalOpacityWhenDone ?? 1)

        const pulseTimeline = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => {
            if (isDisposed) {
              return
            }
            if (!continueWithHoverLoop) {
              return
            }
            opacityTweens = createHoverOpacityLoop()
            if (!visibilityActive) {
              opacityTweens.forEach((tween) => tween.pause())
            }
          },
        })
        pulseTimeline.to(blobOpacityLayer, {
          opacity: pulse.min,
          duration: pulse.fadeOutDuration,
          ease: 'power2.in',
        })
        pulseTimeline.to(blobOpacityLayer, {
          opacity: pulse.min,
          duration: pulse.holdDuration,
          ease: 'none',
        })
        pulseTimeline.to(blobOpacityLayer, {
          opacity: finalOpacity,
          duration: pulse.fadeInDuration,
          ease: 'power3.out',
        })
        opacityTweens = [pulseTimeline]
        if (!visibilityActive) {
          pulseTimeline.pause()
        }
      }

      const startOpacityLoops = (mode: MotionMode, immediate = false, withHoverPulse = false) => {
        killOpacityTweens()

        if (mode === 'idle') {
          setBlobTargetsOpacity(1, true)
          setLayerOpacity(motionConfig.idle.opacity.value, immediate)
          return
        }

        setBlobTargetsOpacity(1, true)
        if (!blobOpacityLayer) {
          return
        }

        if (withHoverPulse && !immediate) {
          startLayerOpacityPulse({ immediate, continueWithHoverLoop: true })
          return
        }

        opacityTweens = createHoverOpacityLoop()

        if (!visibilityActive) {
          opacityTweens.forEach((tween) => tween.pause())
        }
      }

      const morphToColor = (color: IntroBlobColor | null, immediate = false) => {
        killColorTweens()

        blobs.forEach((blob) => {
          const resolvedColor = color ?? blob.defaultColor
          blobColors.forEach((layerColor) => {
            colorTweens.push(
              gsap.to(blob.layers[layerColor], {
                opacity: layerColor === resolvedColor ? 1 : 0,
                duration: immediate ? 0 : motionConfig.transition.duration,
                ease: immediate ? 'none' : motionConfig.transition.ease,
                overwrite: 'auto',
              }),
            )
          })
        })
      }

      const setHoverTarget = (hoverTarget: UspHoverTarget | null, immediate = false) => {
        killModeTween()

        if (hoverTarget) {
          modeFlags.isHoverMode = true
          setOrbitPlayback(true)

          killCenterTween()
          const localHoverTarget = viewportToContainerPoint(hoverTarget)
          const shouldTweenCenter = !immediate && modeState.progress > 0.01
          if (shouldTweenCenter) {
            centerTween = gsap.to(hoverCenterState, {
              x: localHoverTarget.x,
              y: localHoverTarget.y,
              duration: motionConfig.transition.duration,
              ease: motionConfig.transition.ease,
              overwrite: 'auto',
              onUpdate: updateLayout,
            })
          } else {
            hoverCenterState.x = localHoverTarget.x
            hoverCenterState.y = localHoverTarget.y
          }

          modeTween = gsap.to(modeState, {
            progress: 1,
            duration: immediate ? 0 : motionConfig.transition.duration,
            ease: immediate ? 'none' : motionConfig.transition.ease,
            overwrite: 'auto',
            onUpdate: updateLayout,
          })

          morphToColor(hoverTarget.color, immediate)
          startOpacityLoops('hover', immediate, true)
          updateLayout()
          return
        }

        modeFlags.isHoverMode = false
        refreshIdleAnchors()
        setOrbitPlayback(false)
        killCenterTween()
        if (!immediate) {
          startLayerOpacityPulse({
            immediate: false,
            continueWithHoverLoop: false,
            finalOpacityWhenDone: motionConfig.idle.opacity.value,
          })
        }
        const applyIdleOpacity = () => {
          startOpacityLoops('idle', true)
        }

        modeTween = gsap.to(modeState, {
          progress: 0,
          duration: immediate ? 0 : motionConfig.transition.duration,
          ease: immediate ? 'none' : motionConfig.transition.ease,
          overwrite: 'auto',
          onUpdate: updateLayout,
          onComplete: () => {
            if (modeFlags.isHoverMode) {
              return
            }
            if (!immediate) {
              return
            }
            applyIdleOpacity()
          },
        })

        morphToColor(null, immediate)
        if (immediate) {
          applyIdleOpacity()
        }
        updateLayout()
      }

      gsap.set(
        blobs.map((blob) => blob.target),
        {
          force3D: true,
          transformOrigin: 'center center',
          scale: motionConfig.idle.blobScale,
        },
      )

      gsap.set(
        blobs.flatMap((blob) => blobColors.map((color) => blob.layers[color])),
        { force3D: true },
      )
      if (blobLayer) {
        gsap.set(blobLayer, { autoAlpha: 0 })
      }
      if (blobOpacityLayer) {
        gsap.set(blobOpacityLayer, { opacity: 1 })
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        refreshIdleAnchors()
        setHoverTarget(hoveredUspTarget, true)
        updateLayout()
        revealBlobLayerWhenReady()
        motionControllerRef.current = { setHoverTarget }
        return () => {
          isDisposed = true
          motionControllerRef.current = null
          killCenterTween()
          killModeTween()
          killOpacityTweens()
          killColorTweens()
          killRevealTween()
        }
      }

      refreshIdleAnchors()

      orbitTween = gsap.to(orbitState, {
        phase: `+=${Math.PI * 2}`,
        duration: motionConfig.hover.orbitDurationSeconds,
        ease: 'none',
        repeat: -1,
        onUpdate: updateLayout,
      })

      setHoverTarget(hoveredUspTarget, true)
      updateLayout()
      revealBlobLayerWhenReady()

      const onResize = () => {
        refreshIdleAnchors()
        updateLayout()
      }
      window.addEventListener('resize', onResize)

      const setMotionState = (isActive: boolean) => {
        visibilityActive = isActive

        if (!isActive) {
          orbitTween?.pause()
          opacityTweens.forEach((tween) => tween.pause())
          centerTween?.pause()
          modeTween?.pause()
          return
        }

        if (modeFlags.isHoverMode) {
          setOrbitPlayback(true)
        } else {
          setOrbitPlayback(false)
        }
        opacityTweens.forEach((tween) => tween.resume())
        centerTween?.resume()
        modeTween?.resume()
      }

      const smootherWrapper = document.querySelector<HTMLElement>('#smooth-wrapper')
      const visibilityTrigger = ScrollTrigger.create({
        trigger: motionContainer,
        scroller: smootherWrapper ?? undefined,
        start: 'top bottom',
        end: 'bottom top',
        markers: true,
        onToggle: ({ isActive }) => setMotionState(isActive),
      })
      setMotionState(visibilityTrigger.isActive)

      motionControllerRef.current = { setHoverTarget }

      return () => {
        isDisposed = true
        motionControllerRef.current = null
        window.removeEventListener('resize', onResize)
        visibilityTrigger.kill()

        killCenterTween()
        killModeTween()
        orbitTween?.kill()
        killOpacityTweens()
        killColorTweens()
        killRevealTween()
      }
    },
    { dependencies: [] },
  )

  useEffect(() => {
    motionControllerRef.current?.setHoverTarget(hoveredUspTarget)
  }, [hoveredUspTarget])
}

export default useHeroBackgroundMotion
