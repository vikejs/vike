import React from 'react'
import { landingPageHeroUsps } from '../../../util/constants'
import { H5Headline } from '../../../components/Headline'
import BlurDot from '../../../components/BlurDot'
import { smoothScrollToSelector } from '../../../util/gsap.utils'

const UspHeroMobile = () => {
  return (
    <div className="sm:hidden flex flex-col gap-2 mb-6">
      {landingPageHeroUsps.map((usp) => (
        <button
          type="button"
          key={usp.id}
          style={{
            borderColor: '#e5e5e5',
          }}
          className="rounded-field py-2 px-2 bg-base-200 border relative overflow-hidden w-full cursor-pointer"
          onClick={() => smoothScrollToSelector(`[data-usp-section="${usp.id}"]`, 50)}
        >
          <div className="relative z-2">
            <H5Headline as="h2" className="flex items-center justify-center gap-2">
              <img src={usp.icon} className="h-5 w-5 object-contain shrink-0" />
              <span>{usp.title}</span>
            </H5Headline>
            <p className="text-xs text-grey text-center">{usp.description}</p>
          </div>
          <BlurDot
            type={usp.dotColor}
            size="lg"
            visibility="medium"
            className="absolute -top-10 left-[50%] -translate-x-1/2 z-0"
          />
        </button>
      ))}
    </div>
  )
}

export default UspHeroMobile
