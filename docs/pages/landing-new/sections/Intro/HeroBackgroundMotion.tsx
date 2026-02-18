import React, { useRef } from 'react'

import blurBlue from '../../assets/decorators/blur/raw/blur-blue.png'
import blurGreen from '../../assets/decorators/blur/raw/blur-green.png'
import blurOrange from '../../assets/decorators/blur/raw/blur-orange.png'
import useHeroBackgroundMotion from './useHeroBackgroundMotion'
import type { UspHoverTarget } from './intro.types'

interface HeroBackgroundMotionProps {
  hoveredUspTarget: UspHoverTarget | null
}

const HeroBackgroundMotion = ({ hoveredUspTarget }: HeroBackgroundMotionProps) => {
  const motionContainerRef = useRef<HTMLDivElement>(null)
  useHeroBackgroundMotion({ motionContainerRef, hoveredUspTarget })

  return (
    <div ref={motionContainerRef} className="absolute inset-0 h-screen w-full">
      <div className="absolute z-4 w-full h-1/2 top-0 left-0 bg-linear-to-t to-base-300" />
      <div className="absolute z-1 w-full h-1/4 bottom-0 left-0 bg-linear-to-b to-base-300" />
      <div className="absolute inset-0 overflow-x-hidden pointer-events-none select-none z-0" aria-hidden="true">
        <div
          data-orbit-blob="true"
          data-default-color="blue"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,72vw,82rem)] aspect-square max-w-none will-change-[transform,opacity]"
        >
          <img
            data-blob-color="blue"
            src={blurBlue}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-100 will-change-opacity"
          />
          <img
            data-blob-color="green"
            src={blurGreen}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
          <img
            data-blob-color="orange"
            src={blurOrange}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
        </div>

        <div
          data-orbit-blob="true"
          data-default-color="green"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,72vw,82rem)] aspect-square max-w-none will-change-[transform,opacity]"
        >
          <img
            data-blob-color="blue"
            src={blurBlue}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
          <img
            data-blob-color="green"
            src={blurGreen}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-100 will-change-opacity"
          />
          <img
            data-blob-color="orange"
            src={blurOrange}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
        </div>

        <div
          data-orbit-blob="true"
          data-default-color="orange"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,72vw,82rem)] aspect-square max-w-none will-change-[transform,opacity]"
        >
          <img
            data-blob-color="blue"
            src={blurBlue}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
          <img
            data-blob-color="green"
            src={blurGreen}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-opacity"
          />
          <img
            data-blob-color="orange"
            src={blurOrange}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-100 will-change-opacity"
          />
        </div>
      </div>
    </div>
  )
}

export default HeroBackgroundMotion
