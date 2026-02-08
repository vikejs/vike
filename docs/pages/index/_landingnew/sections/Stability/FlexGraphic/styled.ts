import cm from '@classmatejs/react'
import { ExtensionBlockVariants } from '../../../util/constants'
import { uiConfig } from '../../../util/ui.constants'

export const ExtensionBlock = cm.div.variants<{
  $type: ExtensionBlockVariants
  $animationState?: 'active' | 'inactive'
}>({
  base: `
  absolute 
  rounded-lg
  font-mono
  bg-base-200
  border-2 border-base-100
  text-tiny sm:text-sm text-grey-100
  flex justify-center items-center
  transition-all
  ${uiConfig.transition.shortDurationTw}
  ${uiConfig.transition.easeOutTw}
`,
  variants: {
    $type: {
      react: `
        top-[22.3%] left-[12%]
        h-[15%] w-[33%]
      `,
      core: `
        top-[60.1%] left-[12%]
        h-[30%] w-[33%]
      `,
      apollo: `
        top-[10%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      styledjsx: `
        top-[30.7%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      redux: `
        top-[52.1%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      sentry: `
        top-[74.4%] left-[55.5%]
        h-[11%] w-[35%]
      `,
    },
    $animationState: {
      active: 'text-base-content scale-102',
      inactive: 'bg-base-200/50 scale-100',
    },
  },
})

export const StyledLegendItem = cm.div.variants<{ $type: 'disabled' | 'active' | 'inactive' | 'paused' }>({
  base: `
    relative
    transition-opacity
    font-semibold
    flex items-center gap-2 
    p-1
    ${uiConfig.transition.shortDurationTw}
    ${uiConfig.transition.easeOutTw}
  `,
  variants: {
    $type: {
      disabled: 'opacity-35',
      active: 'opacity-100 ',
      inactive: 'opacity-40',
      paused: 'opacity-70',
    },
  },
  defaultVariants: {
    $type: 'disabled',
  },
})
