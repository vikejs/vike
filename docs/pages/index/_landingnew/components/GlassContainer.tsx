import cm, { cmMerge } from '@classmatejs/react'
import React from 'react'

const GlassContainer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cmMerge('relative', className)} {...props}>
      <StyledGlassOuter>
        <StyledGlassBorder $position="top" />
        <StyledGlassBorder $position="bottom" />
      </StyledGlassOuter>
      <div className="relative">{props.children}</div>
    </div>
  )
}

export default GlassContainer

const StyledGlassOuter = cm.div`
  absolute
  -inset-5
  z-0
  bg-gradient-to-r
  via-white/60
  from-10%
  to-90%
  from-transparent
  to-transparent
`

const StyledGlassBorder = cm.div.variants<{ $position: 'top' | 'bottom' }>({
  base: `
    absolute
    left-0 right-0
    h-0.5
    bg-gradient-to-r from-transparent via-white to-transparent
  `,
  variants: {
    $position: {
      top: 'top-0',
      bottom: 'bottom-0',
    },
  },
})