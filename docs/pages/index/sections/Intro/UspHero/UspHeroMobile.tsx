import React from 'react'
import { landingPageHeroUsps } from '../../../util/constants'
import { H5Headline } from '../../../components/Headline'
import BlurDot from '../../../components/BlurDot'

const UspHeroMobile = () => {
  return (
    <div className="sm:hidden flex flex-col gap-2 mb-6">
      {landingPageHeroUsps.map((usp) => (
        <div
          key={usp.id}
          className="rounded-field py-2 px-2 bg-base-200 border border-base-100 relative overflow-hidden"
        >
          <div className="relative z-2">
            <H5Headline as="h2">
              {usp.icon} {usp.title}
            </H5Headline>
            <p className="text-xs text-grey text-center">{usp.description}</p>
          </div>
          <BlurDot
            type={usp.dotColor}
            size="lg"
            visibility="medium"
            className="absolute -top-10 left-[50%] -translate-x-1/2 z-0"
          />
        </div>
      ))}
    </div>
  )
}

export default UspHeroMobile
