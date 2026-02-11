import cm, { cmMerge } from '@classmatejs/react'
import React from 'react'
import { flexEditorTabs } from '../../../util/constants'
import ToolBlocks from './ToolBlocks'
import { ChevronsDown } from 'lucide-react'
import useNavigationTabsInteractions from './useNavigationTabsInteractions'

const StyledWrapper = cm.div`
  mx-auto w-6/7 
  grid grid-cols-3 gap-10
  z-20
  mt-14
  relative
  overflow-hidden
  pt-3
  px-3
`

const StyledTab = cm.div`
  px-4 py-3 relative z-12
`

const StyledTabBg = cm.div.variants<{ $state: 'active' | 'hover' | 'inactive' }>({
  base: `
    absolute inset-0 
    rounded-t-field
    z-10
    border-primary
    border-b-2
    border-b-base-200
  `,
  variants: {
    $state: {
      active: 'border-b-primary bg-primary',
      hover: 'border-2 border-b-primary border-x-primary',
      inactive: `border-b-2 border-b-primary bg-base-200`,
    },
  },
  defaultVariants: {
    $state: 'inactive',
  },
})

const StyledTabTitle = cm.div<{ $active: boolean }>`
  relative 
  font-bold
  z-11
  ${({ $active }) => ($active ? 'text-white' : 'text-primary')}
  flex items-center justify-between
`

const StyledTabGradient = cm.span`
  absolute -inset-2
  pointer-events-none
  bg-gradient-to-t to-base-300 via-base-300/40 z-13
`

const NavigationTabs = () => {
  const { containerRef, activeTab, handleClick, handleHover, getToolBlocksRef, getTabGradientRef, hoveredTab } =
    useNavigationTabsInteractions()

  return (
    <StyledWrapper ref={containerRef}>
      {flexEditorTabs.map((tab) => {
        const isActive = activeTab === tab.frontend
        const tabBgState = isActive ? 'active' : hoveredTab === tab.frontend ? 'hover' : 'inactive'

        return (
          <div
            key={tab.frontend}
            className="flex flex-col gap-1 relative cursor-pointer"
            onClick={() => handleClick(tab.frontend)}
            onMouseEnter={() => handleHover(tab.frontend)}
            onMouseLeave={() => handleHover(undefined)}
          >
            <ToolBlocks ref={getToolBlocksRef(tab.frontend)} tools={tab.tools} active={isActive} />
            <StyledTabGradient ref={getTabGradientRef(tab.frontend)} />
            <StyledTab>
              <StyledTabBg $state={tabBgState} />
              <StyledTabTitle $active={isActive}>
                {tab.title}
                <ChevronsDown
                  className={cmMerge('inline-block w-4 h-4 ', isActive ? 'text-base-300' : 'text-primary')}
                />
              </StyledTabTitle>
            </StyledTab>
          </div>
        )
      })}
    </StyledWrapper>
  )
}

export default NavigationTabs
