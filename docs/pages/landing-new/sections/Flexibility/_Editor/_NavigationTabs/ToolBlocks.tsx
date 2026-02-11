import React, { forwardRef, useId, useMemo } from 'react'
import { FlexEditorTabTool } from '../../../../util/constants'
import cm, { cmMerge } from '@classmatejs/react'
import { uiConfig } from '../../../../util/ui.constants'

const maxToolBlocksCount = 5

const opacityClass = (i: number, active: boolean) => {
  if (active) {
    return 'opacity-0'
  }
  switch (i) {
    case 0:
      return 'opacity-0'
    case 1:
      return 'opacity-15'
    case 2:
      return 'opacity-30'
    case 3:
      return 'opacity-50'
    case 4:
      return 'opacity-60'
    default:
      return 'opacity-70'
  }
}

const ToolBlocks = forwardRef<HTMLDivElement, { tools: FlexEditorTabTool[]; active: boolean }>(
  ({ tools, active }, ref) => {
    // fill empty blocks, add stable id for react
    const filledTools = useMemo(() => {
      const toolCountDiff = maxToolBlocksCount - tools.length
      const emptyBlocks = Array(toolCountDiff).fill({ name: undefined, imgKey: undefined })
      return [...tools, ...emptyBlocks].map((tool, index) => ({
        name: tool.name,
        imgKey: tool.imgKey,
        id: `${index}`,
        brandColor: tool.brandColor || 'transparent',
      }))
    }, [tools])

    return (
      <div ref={ref} className="flex flex-col-reverse gap-1">
        {filledTools.map((tool, i) => {
          return (
            <StyledToolBlock
              key={tool.id}
              $isEmpty={!tool.name}
              data-tool-block="true"
              data-tool-block-empty={tool.name ? undefined : 'true'}
            >
              {/* gradient from brandColor to transparent - left to right */}
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: `linear-gradient(to right, ${tool.brandColor ?? 'transparent'}, transparent)` }}
              />
              <div
                className={cmMerge(
                  'absolute -inset-1 bg-base-300',
                  uiConfig.transition.mediumDurationTw,
                  opacityClass(i, active),
                )}
              />
              {tool.imgKey && <img src={tool.imgKey} alt={tool.name} className="w-5 h-5" />}
              {tool.name && <span>{tool.name}</span>}
            </StyledToolBlock>
          )
        })}
      </div>
    )
  },
)

export default ToolBlocks

const StyledToolBlock = cm.div.variants<{ $isEmpty: boolean }>({
  base: `
  relative
  origin-center
  flex flex-wrap gap-2
  h-9
  pl-3
  items-center
  rounded-field
  border-1 
  `,
  variants: {
    $isEmpty: {
      true: 'bg-base-200/50 border-base-100',
      false: 'bg-base-200 border-base-100', // not accepted
    },
  },
  defaultVariants: {
    $isEmpty: false,
  },
})
