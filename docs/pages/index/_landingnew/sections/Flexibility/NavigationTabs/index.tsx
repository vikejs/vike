import cm from '@classmatejs/react'
import React from 'react'
import { flexEditorTabs } from '../../../util/constants'
import ToolBlocks from './ToolBlocks'

const StyledWrapper = cm.div`mx-auto w-6/7 grid grid-cols-3 gap-10`

const NavigationTabs = () => {
  // we wanna map over flexEditorTabs

  return (
    <StyledWrapper>
      {flexEditorTabs.map((tab) => {
        return (
          <div key={tab.frontend} className="border p-4">
            <div>{tab.title}</div>
            <ToolBlocks tools={tab.tools} />
          </div>
        )
      })}
    </StyledWrapper>
  )
}

export default NavigationTabs