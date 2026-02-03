import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

type BlurDotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const BlurDotOpacity = {
  low: 'opacity-15',
  medium: 'opacity-30',
  high: 'opacity-50',
} as const

export type BlurDotOpacity = keyof typeof BlurDotOpacity

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

const pathBase = '/decorators/blur/'

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
  const imgUrl = `${pathBase}blur-${type}.avif`
  const mobileImgUrl = `${pathBase}blur-${type}@0.5.avif`
  const sizePx = sizePxBySize[size]
  const mobileSizePx = Math.round(sizePx / 2)

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
