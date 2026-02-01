import cm from '@classmatejs/react'
import { LayoutSize } from '../util/constants'

const layoutComponentSizeMapping = {
  xxs: 'max-w-[480px]',
  xs: 'max-w-[768px]',
  sm: 'max-w-[1000px]',
  md: 'max-w-[1100px]', // 1140 base header width - 2 x 20px padding from header elements..
  lg: 'max-w-[1400px]',
} as const

interface LayoutComponentProps {
  $size?: LayoutSize
  $noGrow?: boolean
}

const LayoutComponent = cm.div.variants<LayoutComponentProps>({
  base: ({ $noGrow }) => ($noGrow ? '' : 'm-auto w-full'),
  variants: {
    $size: layoutComponentSizeMapping,
  },
  defaultVariants: {
    $size: LayoutSize.md,
  },
})

export default LayoutComponent
