import cm from '@classmatejs/react'
import React, { HTMLAttributes } from 'react'

const StyledBlurDot = cm.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  z-index: 0;
`

const StyledBlurDotImage = cm.img`
  absolute
  w-full
  h-full
  object-cover
`

const BlurDot = ({ ...props }: HTMLAttributes<HTMLDivElement>) => (
  <>
    <StyledBlurDot className={`${props.className ?? ''}`}>
      <StyledBlurDotImage
        crossOrigin="anonymous"
        width={200}
        height={200}
        src={`/blur/dot.avif`}
        fetchPriority="low"
        alt="decorative blurred dot"
      />
    </StyledBlurDot>
  </>
)

export default BlurDot
