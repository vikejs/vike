import { useEffect, useRef, useState } from 'react'
import { flexEditorTabs, NavigationTabFramework } from '../../../../util/constants'
import { useGSAP } from '@gsap/react'
import {
  applyGrayscale,
  createPipeWaveTimeline,
  gradientActiveOffset,
  gradientHoverOffset,
  moveTabGradient,
} from './animations'
import { killTweens } from '../../../../util/gsap.utils'

const useNavigationTabsInteractions = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const toolBlocksRefMap = useRef<Partial<Record<NavigationTabFramework, HTMLDivElement | null>>>({})
  const gradientRefMap = useRef<Partial<Record<NavigationTabFramework, HTMLSpanElement | null>>>({})
  const waveTimelineMap = useRef<
    Partial<Record<NavigationTabFramework, Array<Exclude<ReturnType<typeof createPipeWaveTimeline>, null>>>>
  >({})

  const [activeTab, setActiveTab] = useState<NavigationTabFramework | undefined>(flexEditorTabs[0].frontend)
  const [hoveredTab, setHoveredTab] = useState<NavigationTabFramework | undefined>()

  const hasInitializedRef = useRef(false)

  const collectToolBlocks = (container: HTMLDivElement | null, includeEmpty = false) => {
    if (!container) {
      return [] as HTMLElement[]
    }
    const selector = includeEmpty
      ? '[data-tool-block="true"]'
      : '[data-tool-block="true"]:not([data-tool-block-empty="true"])'
    const nodes = Array.from(container.querySelectorAll<HTMLElement>(selector))
    return nodes.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
  }

  const collectAllTargets = () => {
    const targets: HTMLElement[] = []
    Object.values(toolBlocksRefMap.current).forEach((container) => {
      targets.push(...collectToolBlocks(container ?? null))
    })
    return Array.from(new Set(targets))
  }

  const { contextSafe } = useGSAP(
    () => {
      const baseMode = hasInitializedRef.current ? 'to' : 'set'
      const allTargets = collectAllTargets()

      killTweens(allTargets, 'filter')
      applyGrayscale({ targets: allTargets, amount: 1, mode: baseMode })

      if (activeTab) {
        const activeTargets = collectToolBlocks(toolBlocksRefMap.current[activeTab] ?? null)
        applyGrayscale({ targets: activeTargets, amount: 0, mode: 'to' })
      }

      if (hoveredTab && hoveredTab !== activeTab) {
        const hoveredTargets = collectToolBlocks(toolBlocksRefMap.current[hoveredTab] ?? null)
        applyGrayscale({ targets: hoveredTargets, amount: 0, mode: 'to' })
      }

      Object.entries(gradientRefMap.current).forEach(([tabKey, gradient]) => {
        const tab = tabKey as NavigationTabFramework
        const isActive = tab === activeTab
        const isHovered = tab === hoveredTab && !isActive
        const y = isActive ? gradientActiveOffset : isHovered ? gradientHoverOffset : 0
        moveTabGradient({ target: gradient ?? null, y, mode: baseMode })
      })
      hasInitializedRef.current = true
    },
    { dependencies: [activeTab, hoveredTab] },
  )

  const handleHover = contextSafe((tabFrontend: NavigationTabFramework | undefined) => {
    setHoveredTab(tabFrontend)
  })

  const handleClick = contextSafe((tabFrontend: NavigationTabFramework) => {
    setActiveTab(tabFrontend)

    const waveTargets = collectToolBlocks(toolBlocksRefMap.current[tabFrontend] ?? null, true)
    killTweens(waveTargets)
    const timeline = createPipeWaveTimeline(waveTargets)
    if (timeline) {
      const timelines = waveTimelineMap.current[tabFrontend] ?? []
      waveTimelineMap.current[tabFrontend] = timelines
      timelines.push(timeline)
      timeline.eventCallback('onComplete', () => {
        const current = waveTimelineMap.current[tabFrontend]
        if (!current) {
          return
        }
        waveTimelineMap.current[tabFrontend] = current.filter((entry) => entry !== timeline)
      })
    }
  })

  const getToolBlocksRef = (tabFrontend: NavigationTabFramework) => (node: HTMLDivElement | null) => {
    toolBlocksRefMap.current[tabFrontend] = node
  }

  const getTabGradientRef = (tabFrontend: NavigationTabFramework) => (node: HTMLSpanElement | null) => {
    gradientRefMap.current[tabFrontend] = node
  }

  useEffect(
    () => () => {
      Object.values(waveTimelineMap.current).forEach((timelines) => {
        timelines?.forEach((timeline) => timeline.kill())
      })
    },
    [],
  )

  return {
    containerRef,
    getTabGradientRef,
    getToolBlocksRef,
    activeTab,
    setActiveTab,
    handleClick,
    handleHover,
    hoveredTab,
  }
}

export default useNavigationTabsInteractions
