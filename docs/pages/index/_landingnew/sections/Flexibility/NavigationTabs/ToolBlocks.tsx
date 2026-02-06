import React, { useMemo } from 'react'
import { FlexEditorTabTool } from '../../../util/constants'
import cm from '@classmatejs/react'

const StyledToolBlock = cm.div`
  flex
  flex-wrap
  gap-2
  mt-2
`

const ToolBlocks = ({ tools }: { tools: FlexEditorTabTool[] }) => {
  const filledTools = useMemo(() => {
    const maxToolBlocks = tools.length + 1
    const emptyBlocksCount = maxToolBlocks - tools.length
    const emptyBlocks = Array(emptyBlocksCount).fill({ name: undefined, imgKey: undefined })
    return [...tools, ...emptyBlocks]
  }, [tools])

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {filledTools.map((tool) => (
        <StyledToolBlock key={tool.name}>
          {tool.imgKey && <img src={tool.imgKey} alt={tool.name} className="w-6 h-6 mr-2" />}
          {tool.name && <span>{tool.name}</span>}
        </StyledToolBlock>
      ))}
    </div>
  )
}
export default ToolBlocks