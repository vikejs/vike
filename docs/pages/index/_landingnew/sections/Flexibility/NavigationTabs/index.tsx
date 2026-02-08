import cm from '@classmatejs/react'
import React, { useEffect, useState } from 'react'
import { flexEditorTabs, NavigationTabFramework } from '../../../util/constants'
import ToolBlocks from './ToolBlocks'
import { ChevronsDown } from 'lucide-react'
import useNavigationTabsInteractions from './useNavigationTabsInteractions'

const StyledWrapper = cm.div`
  mx-auto w-6/7 
  grid grid-cols-3 gap-4
  overflow-hidden
  z-0
`

const StyledTab = cm.div`
  px-4 py-3 relative
`
const StyledTabBg = cm.div<{ $active: boolean }>`
  absolute inset-0 
  rounded-t-field
  z-10
  border-primary
  border-t-2
  border-x-2
  ${({ $active }) =>
    $active
      ? 'bg-base-200'
      : `
    border-t-0 border-x-0 border-b-2
    bg-base-200/50
  `}
`

const StyledTabTitle = cm.div`
  relative 
  font-bold
  z-11
  flex items-center justify-between
`

const StyledTabGradient = cm.span`
  absolute -inset-1  
  pointer-events-none
  bg-gradient-to-t to-base-300 via-base-300/40 z-10
`

const NavigationTabs = () => {
  const { containerRef, activeTab, setActiveTab, handleHover, getToolBlocksRef } = useNavigationTabsInteractions()

  return (
    <StyledWrapper ref={containerRef}>
      {flexEditorTabs.map((tab) => {
        const isActive = activeTab === tab.frontend

        return (
          <div
            key={tab.frontend}
            className="flex flex-col gap-1 relative"
            onClick={() => setActiveTab(tab.frontend)}
            onMouseEnter={() => handleHover(tab.frontend)}
            onMouseLeave={() => handleHover(undefined)}
          >
            <ToolBlocks ref={getToolBlocksRef(tab.frontend)} tools={tab.tools} />
            <StyledTabGradient />
            <StyledTab>
              <StyledTabBg $active={isActive} />
              <StyledTabTitle>
                {tab.title}
                <ChevronsDown className="inline-block w-4 h-4 text-grey-200" />
              </StyledTabTitle>
            </StyledTab>
          </div>
        )
      })}
    </StyledWrapper>
  )
}

export default NavigationTabs
