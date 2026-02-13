import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import { FlexGraphicHook, HOOK_NAME_KEYS } from '../../../util/constants'
import { applyColor, applyStrokeWidth, createSlideshowScrollTrigger } from './animations'
import { debounce } from '../../../util/gsap.utils'
import { hookColors, uiConfig } from '../../../util/ui.constants'

const circuitDefaultColor = 'var(--color-grey-300-hex)'
const baseStrokeWidth = 3
const activeStrokeWidth = 3.5
const hitboxStrokeWidth = 10

const slideshowIntervalMs = 2000
const slideshowResumeDelayMs = 600
const highlightDebounceMs = 30

const resolveCssColor = (color: string, root?: Element | null) => {
  const match = color.match(/^var\((--[^)]+)\)$/)
  if (!match) {
    return color
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return color
  }
  const baseElement = root ?? document.documentElement
  const value = getComputedStyle(baseElement).getPropertyValue(match[1]).trim()
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
  const containerRef = useRef<HTMLDivElement>(null)
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
  const [isScrollActive, setIsScrollActive] = useState(false)
  const slideshowIndexRef = useRef(0)
  const slideshowResumeTimeoutRef = useRef<number | null>(null)
  const getThemeRoot = () => {
    if (typeof document === 'undefined') {
      return null
    }
    return containerRef.current?.closest('#tailwind-portal') ?? document.documentElement
  }

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

  const hookTimelinesRef = useRef<Partial<Record<FlexGraphicHook, gsap.core.Timeline>>>({})
  const hasBuiltTimelinesRef = useRef(false)

  const buildHookTimelines = () => {
    const themeRoot = getThemeRoot()
    const baseColor = resolveCssColor(circuitDefaultColor, themeRoot)
    const allTargets = collectAllTargets(hookRefMap)

    if (!allTargets.strokeTargets.length && !allTargets.fillTargets.length) {
      return false
    }

    applyColor({ targets: allTargets.strokeTargets, color: baseColor, mode: 'set', attr: 'stroke' })
    applyColor({ targets: allTargets.fillTargets, color: baseColor, mode: 'set', attr: 'fill' })
    applyStrokeWidth(allTargets.strokeTargets, baseStrokeWidth, 'set')

    const hookTimelines: Partial<Record<FlexGraphicHook, gsap.core.Timeline>> = {}

    HOOK_NAME_KEYS.forEach((hookName) => {
      const ref = hookRefMap[hookName]
      if (!ref?.current) {
        return
      }

      const targets = collectTargets(ref)
      if (!targets.strokeTargets.length && !targets.fillTargets.length) {
        return
      }

      const hookColor = resolveCssColor(hookColors[hookName], themeRoot)
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: uiConfig.transition.shortDuration,
          ease: uiConfig.transition.easeOutGsap,
          overwrite: 'auto',
        },
      })

      if (targets.strokeTargets.length) {
        timeline.to(
          targets.strokeTargets,
          {
            attr: { stroke: hookColor, 'stroke-width': activeStrokeWidth },
          },
          0,
        )
      }

      if (targets.fillTargets.length) {
        timeline.to(targets.fillTargets, { attr: { fill: hookColor } }, 0)
      }

      hookTimelines[hookName] = timeline
    })

    hookTimelinesRef.current = hookTimelines
    return true
  }

  const syncHookTimelines = (hooks: FlexGraphicHook[] | null) => {
    const activeSet = new Set(hooks ?? [])
    Object.entries(hookTimelinesRef.current).forEach(([hookName, timeline]) => {
      if (!timeline) {
        return
      }
      if (activeSet.has(hookName as FlexGraphicHook)) {
        timeline.play()
      } else {
        timeline.reverse()
      }
    })
  }

  // build timelines once and then play/reverse them on state changes
  const { contextSafe } = useGSAP(
    () => {
      if (!hasBuiltTimelinesRef.current) {
        const didBuild = buildHookTimelines()
        if (!didBuild) {
          return
        }
        hasBuiltTimelinesRef.current = true
      }

      syncHookTimelines(activeHooks)
    },
    { dependencies: [activeHooks] },
  )

  const handleChangeHighlight = contextSafe((hooks: FlexGraphicHook[] | null) => {
    if (!isScrollActive) {
      return
    }

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

  const handleChangeHighlightRef = useRef(handleChangeHighlight)
  handleChangeHighlightRef.current = handleChangeHighlight
  const debouncedChangeHighlightRef = useRef(
    debounce((hooks: FlexGraphicHook[] | null) => {
      handleChangeHighlightRef.current(hooks)
    }, highlightDebounceMs),
  )

  useEffect(
    () => () => {
      debouncedChangeHighlightRef.current.cancel()
    },
    [],
  )

  const onChangeHightlight = (hooks: FlexGraphicHook[] | null) => {
    debouncedChangeHighlightRef.current(hooks)
  }

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

  useGSAP(() => {
    if (!containerRef.current) {
      return
    }
    createSlideshowScrollTrigger({
      trigger: containerRef.current,
      onEnter: () => {
        setIsScrollActive(true)
        if (slideshowResumeTimeoutRef.current) {
          window.clearTimeout(slideshowResumeTimeoutRef.current)
          slideshowResumeTimeoutRef.current = null
        }
        slideshowIndexRef.current = 0
        setIsSlideshowMode(true)
      },
      onEnterBack: () => {
        setIsScrollActive(true)
        if (slideshowResumeTimeoutRef.current) {
          window.clearTimeout(slideshowResumeTimeoutRef.current)
          slideshowResumeTimeoutRef.current = null
        }
        slideshowIndexRef.current = 0
        setIsSlideshowMode(true)
      },
      onLeave: () => {
        setIsScrollActive(false)
        if (slideshowResumeTimeoutRef.current) {
          window.clearTimeout(slideshowResumeTimeoutRef.current)
          slideshowResumeTimeoutRef.current = null
        }
        setIsSlideshowMode(false)
        setActiveHooks(null)
      },
      onLeaveBack: () => {
        setIsScrollActive(false)
        if (slideshowResumeTimeoutRef.current) {
          window.clearTimeout(slideshowResumeTimeoutRef.current)
          slideshowResumeTimeoutRef.current = null
        }
        setIsSlideshowMode(false)
        setActiveHooks(null)
      },
    })
  })

  // slideshow effect
  useEffect(() => {
    const isSlideshowActive = isSlideshowMode && isScrollActive
    if (!isSlideshowActive || !HOOK_NAME_KEYS.length) {
      return
    }
    setActiveHooks([HOOK_NAME_KEYS[slideshowIndexRef.current % HOOK_NAME_KEYS.length]])

    const intervalId = window.setInterval(() => {
      slideshowIndexRef.current = (slideshowIndexRef.current + 1) % HOOK_NAME_KEYS.length
      setActiveHooks([HOOK_NAME_KEYS[slideshowIndexRef.current]])
    }, slideshowIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [isSlideshowMode, isScrollActive, slideshowIntervalMs])

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
    containerRef,
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
