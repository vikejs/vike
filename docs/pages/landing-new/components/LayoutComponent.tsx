import cm from '@classmatejs/react'
import { layoutComponentSizeMapping, LayoutSize } from '../util/ui.constants'

interface LayoutComponentProps {
  $size?: LayoutSize
  $noGrow?: boolean
}

const LayoutComponent = cm.div.variants<LayoutComponentProps>({
  base: ({ $noGrow }) => `px-2 md:px-4 ${$noGrow ? '' : 'm-auto w-full'} relative`,
  variants: {
    $size: layoutComponentSizeMapping,
  },
  defaultVariants: {
    $size: LayoutSize.md,
  },
})

export default LayoutComponent
