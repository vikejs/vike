import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

type BlurDotSize = 'sm' | 'md' | 'lg' | 'xl'
type BlurDotType = 'blue' | 'green' | 'orange'
type BlurDotOpacity = 'low' | 'medium' | 'high'

const StyledBlurDot = cm.div.variants<{ $size: BlurDotSize; $opacity: BlurDotOpacity }>({
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
    $opacity: {
      low: 'opacity-10',
      medium: 'opacity-30',
      high: 'opacity-50',
    },
  },
  defaultVariants: {
    $size: 'md',
    $opacity: 'medium',
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
  opacity?: BlurDotOpacity
}

const sizePxBySize: Record<BlurDotSize, number> = {
  sm: 144,
  md: 192,
  lg: 288,
  xl: 384,
}

const BlurDot = ({ type, lazy = true, opacity = 'medium', size = 'md', ...props }: BlurDotProps) => {
  const imgUrl = `${pathBase}blur-${type}.avif`
  const mobileImgUrl = `${pathBase}blur-${type}@0.5.avif`
  const sizePx = sizePxBySize[size]
  const mobileSizePx = Math.round(sizePx / 2)

  return (
    <>
      <StyledBlurDot $opacity={opacity} $size={size} className={`${props.className ?? ''}`}>
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
