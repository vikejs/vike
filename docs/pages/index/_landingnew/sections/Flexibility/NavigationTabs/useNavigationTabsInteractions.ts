import { useRef, useState } from 'react'
import { flexEditorTabs, NavigationTabFramework } from '../../../util/constants'
import { useGSAP } from '@gsap/react'
import { applyGrayscale } from './animations'
import { killTweens } from '../../../util/gsap.utils'

const useNavigationTabsInteractions = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const toolBlocksRefMap = useRef<Partial<Record<NavigationTabFramework, HTMLDivElement | null>>>({})

  const [activeTab, setActiveTab] = useState<NavigationTabFramework | undefined>(flexEditorTabs[0].frontend)
  const [hoveredTab, setHoveredTab] = useState<NavigationTabFramework | undefined>()

  const hasInitializedRef = useRef(false)

  const collectToolBlocks = (container: HTMLDivElement | null) => {
    if (!container) {
      return [] as HTMLElement[]
    }
    return Array.from(
      container.querySelectorAll<HTMLElement>('[data-tool-block="true"]:not([data-tool-block-empty="true"])'),
    )
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

      killTweens(allTargets)
      applyGrayscale({ targets: allTargets, amount: 1, mode: baseMode })

      if (activeTab) {
        const activeTargets = collectToolBlocks(toolBlocksRefMap.current[activeTab] ?? null)
        applyGrayscale({ targets: activeTargets, amount: 0, mode: 'to' })
      }

      if (hoveredTab) {
        const hoveredTargets = collectToolBlocks(toolBlocksRefMap.current[hoveredTab] ?? null)
        applyGrayscale({ targets: hoveredTargets, amount: 0, mode: 'to' })
      }

      hasInitializedRef.current = true
    },
    { dependencies: [activeTab, hoveredTab] },
  )

  const handleHover = contextSafe((tabFrontend: NavigationTabFramework | undefined) => {
    setHoveredTab(tabFrontend)
  })

  const getToolBlocksRef = (tabFrontend: NavigationTabFramework) => (node: HTMLDivElement | null) => {
    toolBlocksRefMap.current[tabFrontend] = node
  }

  return {
    containerRef,
    getToolBlocksRef,
    activeTab,
    setActiveTab,
    handleHover,
    hoveredTab,
  }
}

export default useNavigationTabsInteractions
