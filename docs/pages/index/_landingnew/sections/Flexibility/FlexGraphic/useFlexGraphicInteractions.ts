import { useEffect, useRef, useState, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'

import { FlexGraphicHook, HOOK_COLORS, HOOK_NAME_KEYS } from '../../../util/constants'
import { applyColor, applyStrokeWidth, killTweens } from './animations'

// todo: to config

const baseColor = '#E3E3E3' // bad - use CSS variable here
const baseStrokeWidth = 3
const activeStrokeWidth = 4
const hitboxStrokeWidth = 14

const slideshowIntervalMs = 2000
const slideshowResumeDelayMs = 1200

const resolveCssColor = (color: string) => {
  const match = color.match(/^var\((--[^)]+)\)$/)
  if (!match) {
    return color
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim()
  return value || color
}

const collectTargets = (ref: RefObject<SVGGElement | null>) => {
  if (!ref.current) {
    return { strokeTargets: [] as SVGElement[], fillTargets: [] as SVGElement[] }
  }

  const nodes = Array.from(
    ref.current.querySelectorAll<SVGElement>('[stroke]:not([data-hitbox]), [fill]:not([data-hitbox])'),
  )
  const strokeTargets = nodes.filter((node) => node.hasAttribute('stroke'))
  const fillTargets = nodes.filter((node) => node.hasAttribute('fill'))

  return { strokeTargets, fillTargets }
}

const collectAllTargets = (hookRefMap: HookRefMap) => {
  const strokeTargets: SVGElement[] = []
  const fillTargets: SVGElement[] = []

  Object.values(hookRefMap).forEach((ref) => {
    const targets = collectTargets(ref)
    strokeTargets.push(...targets.strokeTargets)
    fillTargets.push(...targets.fillTargets)
  })

  return {
    strokeTargets: Array.from(new Set(strokeTargets)),
    fillTargets: Array.from(new Set(fillTargets)),
  }
}

interface HookRefMap {
  [key: string]: RefObject<SVGGElement | null>
}

const useFlexGraphicInteractions = () => {
  const onRenderClientRef = useRef<SVGGElement>(null)
  const wrapperRef = useRef<SVGGElement>(null)
  const onCreatePageContextRef = useRef<SVGGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const onHookCallRef = useRef<SVGGElement>(null)
  const onBeforeRenderHtmlRef = useRef<SVGGElement>(null)
  const onBeforeRenderClientRef = useRef<SVGGElement>(null)
  const onCreateGlobalContextRef = useRef<SVGGElement>(null)
  const onErrorRef = useRef<SVGGElement>(null)
  const onRenderHtmlRef = useRef<SVGGElement>(null)
  const onAfterRenderHtmlRef = useRef<SVGGElement>(null)

  const [activeHooks, setActiveHooks] = useState<FlexGraphicHook[] | null>(
    HOOK_NAME_KEYS.length ? [HOOK_NAME_KEYS[0]] : null,
  )
  const [isSlideshowMode, setIsSlideshowMode] = useState(true)
  const slideshowIndexRef = useRef(0)
  const slideshowResumeTimeoutRef = useRef<number | null>(null)

  const hookRefMap: HookRefMap = {
    onRenderClient: onRenderClientRef,
    Wrapper: wrapperRef,
    onCreatePageContext: onCreatePageContextRef,
    Head: headRef,
    onHookCall: onHookCallRef,
    onBeforeRenderHtml: onBeforeRenderHtmlRef,
    onBeforeRenderClient: onBeforeRenderClientRef,
    onCreateGlobalContext: onCreateGlobalContextRef,
    onError: onErrorRef,
    onRenderHtml: onRenderHtmlRef,
    onAfterRenderHtml: onAfterRenderHtmlRef,
  }

  const hasInitializedRef = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      const baseMode = hasInitializedRef.current ? 'to' : 'set'
      const allTargets = collectAllTargets(hookRefMap)
      const allElements = [...allTargets.strokeTargets, ...allTargets.fillTargets]

      killTweens(allElements)

      applyColor({ targets: allTargets.strokeTargets, color: baseColor, mode: baseMode, attr: 'stroke' })
      applyColor({ targets: allTargets.fillTargets, color: baseColor, mode: baseMode, attr: 'fill' })
      applyStrokeWidth(allTargets.strokeTargets, baseStrokeWidth, baseMode)

      if (activeHooks?.length) {
        activeHooks.forEach((hookName) => {
          const ref = hookRefMap[hookName]
          if (!ref) {
            return
          }

          const targets = collectTargets(ref)
          const hookColor = resolveCssColor(HOOK_COLORS[hookName])

          applyColor({ targets: targets.strokeTargets, color: hookColor, mode: 'to', attr: 'stroke' })
          applyColor({ targets: targets.fillTargets, color: hookColor, mode: 'to', attr: 'fill' })
          applyStrokeWidth(targets.strokeTargets, activeStrokeWidth, 'to')
        })
      }

      hasInitializedRef.current = true
    },
    { dependencies: [activeHooks] },
  )

  const onChangeHightlight = contextSafe((hooks: FlexGraphicHook[] | null) => {
    setActiveHooks(hooks)
    if (slideshowResumeTimeoutRef.current) {
      window.clearTimeout(slideshowResumeTimeoutRef.current)
      slideshowResumeTimeoutRef.current = null
    }

    if (hooks === null) {
      slideshowResumeTimeoutRef.current = window.setTimeout(() => {
        setIsSlideshowMode(true)
      }, slideshowResumeDelayMs)
      return
    }

    setIsSlideshowMode(false)
  })

  // setup hitboxes
  useEffect(() => {
    Object.values(hookRefMap).forEach((ref) => {
      if (!ref.current || ref.current.querySelector('[data-hitbox="true"]')) {
        return
      }
      const hitTargets = Array.from(
        ref.current.querySelectorAll<SVGElement>('path, line, polyline, polygon, rect, circle, ellipse'),
      )

      hitTargets.forEach((target) => {
        const hitbox = target.cloneNode(false) as SVGElement
        hitbox.setAttribute('data-hitbox', 'true')
        hitbox.setAttribute('fill', 'none')
        hitbox.setAttribute('stroke', 'transparent')
        hitbox.setAttribute('stroke-width', String(hitboxStrokeWidth))
        hitbox.setAttribute('pointer-events', 'stroke')
        hitbox.setAttribute('vector-effect', 'non-scaling-stroke')
        hitbox.setAttribute('aria-hidden', 'true')
        ref.current?.insertBefore(hitbox, ref.current.firstChild)
      })
    })
  }, [])

  // slideshow effect
  useEffect(() => {
    if (!isSlideshowMode || !HOOK_NAME_KEYS.length) {
      return
    }
    setActiveHooks([HOOK_NAME_KEYS[slideshowIndexRef.current % HOOK_NAME_KEYS.length]])

    const intervalId = window.setInterval(() => {
      slideshowIndexRef.current = (slideshowIndexRef.current + 1) % HOOK_NAME_KEYS.length
      setActiveHooks([HOOK_NAME_KEYS[slideshowIndexRef.current]])
    }, slideshowIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [isSlideshowMode, slideshowIntervalMs])

  useEffect(
    () => () => {
      if (slideshowResumeTimeoutRef.current) {
        window.clearTimeout(slideshowResumeTimeoutRef.current)
      }
    },
    [],
  )

  return {
    onRenderClientRef,
    wrapperRef,
    onCreatePageContextRef,
    headRef,
    onHookCallRef,
    onBeforeRenderHtmlRef,
    onCreateGlobalContextRef,
    onErrorRef,
    onRenderHtmlRef,
    onAfterRenderHtmlRef,
    onBeforeRenderClientRef,
    onChangeHightlight,
    activeHooks,
    isSlideshowMode,
  }
}

export default useFlexGraphicInteractions
