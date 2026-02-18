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
  },
  idle: {
    yOffsetPx: -70,
    blobScale: 0.24,
    opacity: {
      range: {
        blue: { min: 0.4, max: 0.5 },
        green: { min: 0.4, max: 0.5 },
        orange: { min: 0.4, max: 0.5 },
      },
      durationSeconds: { min: 7.5, max: 13 },
    },
    drift: {
      rangePx: {
        x: { min: 6, max: 18 },
        y: { min: 4, max: 14 },
      },
      durationSeconds: { min: 2.5, max: 5 },
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
      range: {
        blue: { min: 0.9, max: 1 },
        green: { min: 0.9, max: 1 },
        orange: { min: 0.9, max: 1 },
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

const getRandomSignedOffset = (min: number, max: number) => {
  const sign = Math.random() < 0.5 ? -1 : 1
  return sign * R(min, max)
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
        driftEnabled: !hoveredUspTarget,
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

      const driftStates = blobs.map(() => ({ x: 0, y: 0 }))

      let centerTween: gsap.core.Tween | null = null
      let modeTween: gsap.core.Tween | null = null
      let orbitTween: gsap.core.Tween | null = null
      let driftTweens: gsap.core.Tween[] = []
      let opacityTweens: gsap.core.Tween[] = []
      let colorTweens: gsap.core.Tween[] = []
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

        blobs.forEach((blob, index) => {
          const idleAnchor = idleAnchors[blob.defaultColor]
          const drift = driftStates[index] ?? { x: 0, y: 0 }

          const idleX = idleAnchor.x + drift.x
          const idleY = idleAnchor.y + drift.y

          const orbitX =
            hoverCenterState.x +
            Math.cos(orbitState.phase + blob.phaseOffset) * containerWidth * motionConfig.hover.orbitRadiusRatio.x
          const orbitY =
            hoverCenterState.y +
            Math.sin(orbitState.phase + blob.phaseOffset) * containerHeight * motionConfig.hover.orbitRadiusRatio.y

          const x = lerp(idleX, orbitX, modeProgress)
          const y = lerp(idleY, orbitY, modeProgress)
          const scale = lerp(motionConfig.idle.blobScale, motionConfig.hover.blobScale, modeProgress)

          gsap.set(blob.target, {
            x: x - containerCenterX,
            y: y - containerCenterY,
            scale,
          })
        })
      }

      const pauseDriftTweens = () => {
        driftTweens.forEach((tween) => tween.pause())
      }

      const resumeDriftTweens = () => {
        if (!visibilityActive || !modeFlags.driftEnabled) {
          pauseDriftTweens()
          return
        }
        driftTweens.forEach((tween) => tween.resume())
      }

      const startDriftTweens = () => {
        driftTweens.forEach((tween) => tween.kill())
        driftTweens = driftStates.map((state) =>
          gsap.to(state, {
            x: () =>
              getRandomSignedOffset(motionConfig.idle.drift.rangePx.x.min, motionConfig.idle.drift.rangePx.x.max),
            y: () =>
              getRandomSignedOffset(motionConfig.idle.drift.rangePx.y.min, motionConfig.idle.drift.rangePx.y.max),
            duration: () => R(motionConfig.idle.drift.durationSeconds.min, motionConfig.idle.drift.durationSeconds.max),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            onUpdate: updateLayout,
          }),
        )
        resumeDriftTweens()
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

      const getOpacityRange = (blob: BlobConfig, mode: MotionMode) => {
        return mode === 'hover'
          ? motionConfig.hover.opacity.range[blob.defaultColor]
          : motionConfig.idle.opacity.range[blob.defaultColor]
      }

      const getOpacityDurationRange = (mode: MotionMode) => {
        return mode === 'hover' ? motionConfig.hover.opacity.durationSeconds : motionConfig.idle.opacity.durationSeconds
      }

      const startOpacityLoops = (mode: MotionMode, immediate = false) => {
        killOpacityTweens()

        const durationRange = getOpacityDurationRange(mode)
        if (mode === 'idle') {
          const range = motionConfig.idle.opacity.range.blue
          const opacityState = { value: R(range.min, range.max) }

          blobs.forEach((blob) => {
            gsap.set(blob.target, { opacity: opacityState.value })
          })

          opacityTweens = [
            gsap.to(opacityState, {
              value: () => R(range.min, range.max),
              duration: () => R(durationRange.min, durationRange.max),
              delay: immediate ? 0 : R(0.05, 0.25),
              ease: 'sine.inOut',
              repeat: -1,
              repeatRefresh: true,
              yoyo: true,
              onUpdate: () => {
                blobs.forEach((blob) => {
                  gsap.set(blob.target, { opacity: opacityState.value })
                })
              },
            }),
          ]

          if (!visibilityActive) {
            opacityTweens.forEach((tween) => tween.pause())
          }
          return
        }

        opacityTweens = blobs.map((blob) => {
          const range = getOpacityRange(blob, mode)

          return gsap.to(blob.target, {
            opacity: () => R(range.min, range.max),
            duration: () => R(durationRange.min, durationRange.max),
            delay: immediate ? 0 : R(0.05, 0.35),
            ease: mode === 'hover' ? 'power2.inOut' : 'sine.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
          })
        })

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
          modeFlags.driftEnabled = false

          pauseDriftTweens()
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
          startOpacityLoops('hover', immediate)
          updateLayout()
          return
        }

        modeFlags.isHoverMode = false
        modeFlags.driftEnabled = false
        refreshIdleAnchors()
        setOrbitPlayback(false)
        killCenterTween()

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
            modeFlags.driftEnabled = true
            resumeDriftTweens()
          },
        })

        morphToColor(null, immediate)
        startOpacityLoops('idle', immediate)
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

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        refreshIdleAnchors()
        setHoverTarget(hoveredUspTarget, true)
        updateLayout()
        motionControllerRef.current = { setHoverTarget }
        return () => {
          motionControllerRef.current = null
          killCenterTween()
          killModeTween()
          killOpacityTweens()
          killColorTweens()
        }
      }

      refreshIdleAnchors()
      startDriftTweens()

      orbitTween = gsap.to(orbitState, {
        phase: `+=${Math.PI * 2}`,
        duration: motionConfig.hover.orbitDurationSeconds,
        ease: 'none',
        repeat: -1,
        onUpdate: updateLayout,
      })

      setHoverTarget(hoveredUspTarget, true)
      if (!hoveredUspTarget) {
        modeFlags.driftEnabled = true
        resumeDriftTweens()
      }
      updateLayout()

      const onResize = () => {
        refreshIdleAnchors()
        updateLayout()
      }
      window.addEventListener('resize', onResize)

      const setMotionState = (isActive: boolean) => {
        visibilityActive = isActive

        if (!isActive) {
          orbitTween?.pause()
          pauseDriftTweens()
          opacityTweens.forEach((tween) => tween.pause())
          centerTween?.pause()
          modeTween?.pause()
          return
        }

        if (modeFlags.isHoverMode) {
          setOrbitPlayback(true)
          pauseDriftTweens()
        } else {
          setOrbitPlayback(false)
          resumeDriftTweens()
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
        motionControllerRef.current = null
        window.removeEventListener('resize', onResize)
        visibilityTrigger.kill()

        killCenterTween()
        killModeTween()
        orbitTween?.kill()
        driftTweens.forEach((tween) => tween.kill())
        killOpacityTweens()
        killColorTweens()
      }
    },
    { dependencies: [] },
  )

  useEffect(() => {
    motionControllerRef.current?.setHoverTarget(hoveredUspTarget)
  }, [hoveredUspTarget])
}

export default useHeroBackgroundMotion
