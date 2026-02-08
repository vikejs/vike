import React, { forwardRef, useId, useMemo } from 'react'
import { FlexEditorTabTool } from '../../../util/constants'
import cm from '@classmatejs/react'

const maxToolBlocksCount = 5

// we need the ref in the parent to calculate the position of the gradient, so we forward it here

const ToolBlocks = forwardRef<HTMLDivElement, { tools: FlexEditorTabTool[] }>(({ tools }, ref) => {
  // fill empty blocks, add stable id for react
  const filledTools = useMemo(() => {
    const toolCountDiff = maxToolBlocksCount - tools.length
    const emptyBlocks = Array(toolCountDiff).fill({ name: undefined, imgKey: undefined })
    return [...tools, ...emptyBlocks].map((tool, index) => ({
      name: tool.name,
      imgKey: tool.imgKey,
      id: `${index}`,
    }))
  }, [tools])

  return (
    <div ref={ref} className="flex flex-col-reverse gap-1">
      {filledTools.map((tool) => (
        <StyledToolBlock
          key={tool.id}
          $isEmpty={!tool.name}
          data-tool-block="true"
          data-tool-block-empty={tool.name ? undefined : 'true'}
        >
          {tool.imgKey && <img src={tool.imgKey} alt={tool.name} className="w-4 h-4" />}
          {tool.name && <span>{tool.name}</span>}
        </StyledToolBlock>
      ))}
    </div>
  )
})

export default ToolBlocks

const StyledToolBlock = cm.div.variants<{ $isEmpty: boolean }>({
  base: `
  flex flex-wrap gap-2
  h-10
  pl-3
  items-center
  rounded-field
  border-1 
  `,
  variants: {
    $isEmpty: {
      true: 'bg-base-200/50 border-dashed border-base-100',
      false: 'bg-base-200 border-base-100', // not accepted
    },
  },
  defaultVariants: {
    $isEmpty: false,
  },
})
