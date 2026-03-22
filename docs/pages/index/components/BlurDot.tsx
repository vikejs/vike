import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

import blurDotGreenSm from './../assets/decorators/blur/raw/blur-green@0.5.png'
import blurDotBlueSm from './../assets/decorators/blur/raw/blur-blue@0.5.png'
import blurDotOrangeSm from './../assets/decorators/blur/raw/blur-orange@0.5.png'
import { BlurDotOpacity, UiColorVariantKey } from '../util/ui.constants'

const BlurDot = ({ type, lazy = true, visibility = 'medium', size = 'md', ...props }: BlurDotProps) => {
  const sizePx = sizePxBySize[size]
  const mobileSizePx = Math.round(sizePx / 2)
  const { className, ...restProps } = props

  const imgUrl = type === 'blue' ? blurDotBlueSm : type === 'green' ? blurDotGreenSm : blurDotOrangeSm

  return (
    <>
      <StyledBlurDot $visibility={visibility} $size={size} className={className ?? ''} {...restProps}>
        <StyledBlurDotImage
          crossOrigin="anonymous"
          width={sizePx}
          height={sizePx}
          src={imgUrl}
          sizes={`(max-width: 600px) ${mobileSizePx}px, ${sizePx}px`}
          fetchPriority={lazy ? 'low' : 'auto'}
          loading={lazy ? 'lazy' : 'eager'}
          alt="decorative blurred dot"
        />
      </StyledBlurDot>
    </>
  )
}

export default BlurDot

type BlurDotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const StyledBlurDot = cm.div.variants<{ $size: BlurDotSize; $visibility: BlurDotOpacity }>({
  base: `
  absolute
  pointer-events-none
  select-none
  z-0
`,
  variants: {
    $size: {
      xs: 'w-30 h-30',
      sm: 'w-36 h-36',
      md: 'w-48 h-48',
      lg: 'w-96 h-96',
      xl: 'w-120 h-120',
      xxl: 'w-160 h-160',
    },
    $visibility: {
      low: BlurDotOpacity.low,
      medium: BlurDotOpacity.medium,
      high: BlurDotOpacity.high,
    },
  },
  defaultVariants: {
    $size: 'md',
    $visibility: 'medium',
  },
})

const StyledBlurDotImage = cm.img`
  absolute
  w-full
  h-full
  object-cover
`

interface BlurDotProps extends HTMLAttributes<HTMLDivElement> {
  type: UiColorVariantKey
  lazy?: boolean
  size?: BlurDotSize
  visibility?: BlurDotOpacity
}

const sizePxBySize: Record<BlurDotSize, number> = {
  xs: 144,
  sm: 196,
  md: 256,
  lg: 320,
  xl: 500,
  xxl: 640,
}
