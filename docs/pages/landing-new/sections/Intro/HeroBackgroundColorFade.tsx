import React from 'react'

import blurBlue from '../../assets/decorators/blur/big/blur-blue-big.avif'
import blurGreen from '../../assets/decorators/blur/big/blur-green-big.avif'
import blurOrange from '../../assets/decorators/blur/big/blur-orange.avif'
import { UiColorVariantKey } from '../../util/ui.constants'

interface HeroBackgroundColorFadeProps {
  hoveredColor: UiColorVariantKey | null
}

const colorToImage: Record<UiColorVariantKey, string> = {
  blue: blurBlue,
  green: blurGreen,
  orange: blurOrange,
}

const colors: UiColorVariantKey[] = ['green', 'blue', 'orange']

const HeroBackgroundColorFade = ({ hoveredColor }: HeroBackgroundColorFadeProps) => {
  const activeColor = hoveredColor

  return (
    <div
      className="absolute inset-0 h-screen w-full pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute left-[30%] top-[74%] -translate-x-1/2 -translate-y-1/2 w-[clamp(44rem,110vw,130rem)] aspect-square">
        {colors.map((color) => (
          <img
            key={color}
            src={colorToImage[color]}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover will-change-opacity transition-opacity duration-700 ease-in-out ${
              activeColor !== null && color === activeColor ? 'opacity-12' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 h-1/2 w-full bg-linear-to-b to-base-300 z-10" />
    </div>
  )
}

export default HeroBackgroundColorFade
