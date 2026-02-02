import React, { ReactNode, useCallback } from 'react'

import { ExtensionBlock } from './styled'
import {
  EXTENSION_BLOCK_CONNECTED_HOOKS,
  type ExtensionBlockVariants,
  type FlexGraphicHook,
  HOOK_COLORS,
} from '../../../util/constants'

const blocks: { type: ExtensionBlockVariants; label: ReactNode }[] = [
  { type: 'react', label: 'vike-react' },
  { type: 'core', label: 'vike-core' },
  { type: 'apollo', label: 'vike-react-apollo' },
  { type: 'styledjsx', label: 'vike-react-styled-jsx' },
  { type: 'redux', label: 'vike-react-redux' },
  { type: 'sentry', label: 'vike-react-sentry' },
]

const activeBorderColor = 'var(--color-shade)'

interface FlexGraphicBlocksProps {
  activeHooks: FlexGraphicHook[] | null
  activeBlocks?: ExtensionBlockVariants[] | null
  onBlockHover?: (type: ExtensionBlockVariants) => void
  onBlockLeave?: () => void
}

const FlexGraphicBlocks = ({ activeHooks, activeBlocks, onBlockHover, onBlockLeave }: FlexGraphicBlocksProps) => {
  const getConnectedHook = useCallback(
    (type: ExtensionBlockVariants) => {
      if (!activeHooks?.length) {
        return null
      }

      const match = activeHooks.find((hook) => EXTENSION_BLOCK_CONNECTED_HOOKS[type].includes(hook))
      return match ?? null
    },
    [activeHooks],
  )

  return (
    <>
      {blocks.map(({ type, label }) => {
        const connectedHook = getConnectedHook(type)
        const isActive = activeBlocks?.includes(type)
        const borderColor = isActive ? activeBorderColor : connectedHook ? HOOK_COLORS[connectedHook] : undefined
        const shadowType = isActive ? 'active' : (connectedHook ?? 'inactive')
        return (
          <ExtensionBlock
            key={type}
            $type={type}
            $shadowType={shadowType}
            style={borderColor ? { borderColor } : undefined}
            onMouseEnter={() => onBlockHover?.(type)}
            onMouseLeave={() => onBlockLeave?.()}
          >
            {label}
          </ExtensionBlock>
        )
      })}
    </>
  )
}

export default FlexGraphicBlocks
