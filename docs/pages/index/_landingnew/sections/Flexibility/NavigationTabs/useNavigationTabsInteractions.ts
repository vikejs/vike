import { useState } from 'react'
import { flexEditorTabs, NavigationTabFramework } from '../../../util/constants'
import { useGSAP } from '@gsap/react'

const useNavigationTabsInteractions = () => {
  const [activeTab, setActiveTab] = useState<NavigationTabFramework | undefined>(flexEditorTabs[0].frontend)
  const [hoveredTab, setHoveredTab] = useState<NavigationTabFramework | undefined>()

  const { contextSafe } = useGSAP(() => {})

  const handleHover = contextSafe((tabFrontend: NavigationTabFramework | undefined) => {
    setHoveredTab(tabFrontend)
  })

  return {
    activeTab,
    setActiveTab,
    handleHover,
    hoveredTab,
  }
}

export default useNavigationTabsInteractions