import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

import blurDotGreenSm from './../assets/decorators/blur/raw/blur-green@0.5.png'
import blurDotGreen from './../assets/decorators/blur/raw/blur-green.png'
import blurDotBlueSm from './../assets/decorators/blur/raw/blur-blue@0.5.png'
import blurDotBlue from './../assets/decorators/blur/raw/blur-blue.png'
import blurDotOrangeSm from './../assets/decorators/blur/raw/blur-orange@0.5.png'
import blurDotOrange from './../assets/decorators/blur/raw/blur-orange.png'
import { BlurDotOpacity, UiColorVariantKey } from '../util/ui.constants'

const BlurDot = ({ type, lazy = true, visibility = 'medium', size = 'md', ...props }: BlurDotProps) => {
  const sizePx = sizePxBySize[size]
  const mobileSizePx = Math.round(sizePx / 2)

  const mobileImgUrl = type === 'blue' ? blurDotBlueSm : type === 'green' ? blurDotGreenSm : blurDotOrangeSm
  const imgUrl = type === 'blue' ? blurDotBlue : type === 'green' ? blurDotGreen : blurDotOrange

  return (
    <>
      <StyledBlurDot $visibility={visibility} $size={size} className={`${props.className ?? ''}`}>
        <StyledBlurDotImage
          crossOrigin="anonymous"
          width={sizePx}
          height={sizePx}
          src={imgUrl}
          srcSet={`${mobileImgUrl} ${mobileSizePx}w, ${imgUrl} ${sizePx}w`}
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

type BlurDotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const StyledBlurDot = cm.div.variants<{ $size: BlurDotSize; $visibility: BlurDotOpacity }>({
  base: `
  absolute
  pointer-events-none
  select-none
  z-0
`,
  variants: {
    $size: {
      sm: 'w-36 h-36',
      md: 'w-48 h-48',
      lg: 'w-96 h-96',
      xl: 'w-120 h-120',
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
}
