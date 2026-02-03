import cm from '@classmatejs/react'
import { ExtensionBlockVariants } from '../../../util/constants'

export const ExtensionBlock = cm.div.variants<{
  $type: ExtensionBlockVariants
}>({
  base: `
  absolute 
  rounded-lg
  font-mono
  bg-base-200
  border-2 border-base-100
  text-tiny sm:text-sm 
  flex justify-center items-center
  transition-all
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
  },
})

export const StyledLegendItem = cm.div.variants<{ $type: 'disabled' | 'active' | 'inactive' | 'paused' }>({
  base: `
    transition-opacity 
    font-semibold
    flex items-center gap-2 
    p-1
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
