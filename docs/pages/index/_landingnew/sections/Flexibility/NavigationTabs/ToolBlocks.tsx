import React from 'react'
import { FlexEditorTabTool } from '../../../util/constants'
import cm from '@classmatejs/react'

const maxToolBlocks = 5

const StyledToolBlock = cm.div`
  flex
  flex-wrap
  gap-2
  mt-2
`

const ToolBlocks = ({ tools }: { tools: FlexEditorTabTool[] }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tools.map((tool) => (
        <StyledToolBlock key={tool.name}>
          <img src={tool.imgKey} alt={tool.name} className="w-6 h-6 mr-2" />
          <span>{tool.name}</span>
        </StyledToolBlock>
      ))}
    </div>
  )
}
export default ToolBlocks