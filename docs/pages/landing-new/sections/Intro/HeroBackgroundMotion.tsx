import React, { useRef } from 'react'

import blurBlue from '../../assets/decorators/blur/raw/blur-blue.png'
import blurGreen from '../../assets/decorators/blur/raw/blur-green.png'
import blurOrange from '../../assets/decorators/blur/raw/blur-orange.png'
import useHeroBackgroundMotion from './useHeroBackgroundMotion'
import type { IntroBlobColor } from './intro.types'

interface HeroBackgroundMotionProps {
  color: IntroBlobColor
  isActive: boolean
}

const blurByColor: Record<IntroBlobColor, string> = {
  blue: blurBlue,
  green: blurGreen,
  orange: blurOrange,
}

const HeroBackgroundMotion = ({ color, isActive }: HeroBackgroundMotionProps) => {
  const motionContainerRef = useRef<HTMLDivElement>(null)
  useHeroBackgroundMotion({ motionContainerRef, targetColor: color, isActive })
  const blobImage = blurByColor[color]

  return (
    <div ref={motionContainerRef} className="absolute inset-0 h-screen w-full">
      <div
        data-blob-layer="true"
        className="absolute inset-0 overflow-x-hidden pointer-events-none select-none z-0 opacity-0"
      >
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            data-orbit-blob="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,72vw,82rem)] aspect-square max-w-none will-change-[transform,opacity]"
          >
            <img
              src={blobImage}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover will-change-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroBackgroundMotion
