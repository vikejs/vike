import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

import blurDotGreenSm from './../assets/decorators/blur/blur-green@0.5.avif'
import blurDotGreen from './../assets/decorators/blur/blur-green.avif'
import blurDotBlueSm from './../assets/decorators/blur/blur-blue@0.5.avif'
import blurDotBlue from './../assets/decorators/blur/blur-blue.avif'
import blurDotOrangeSm from './../assets/decorators/blur/blur-orange@0.5.avif'
import blurDotOrange from './../assets/decorators/blur/blur-orange.avif'
import { BlurDotOpacity } from '../util/constants'

type BlurDotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type BlurDotType = 'blue' | 'green' | 'orange'

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
      lg: 'w-72 h-72',
      xl: 'w-96 h-96',
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
  type: BlurDotType
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
