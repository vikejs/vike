import React from 'react'
import { landingPageHeroUsps } from '../../../util/constants'
import { H5Headline } from '../../../components/Headline'

const UspHeroMobile = () => {
  return (
    <div className="sm:hidden flex flex-col gap-2 mb-6">
      {landingPageHeroUsps.map((usp) => (
        <div
          key={usp.id}
          className="rounded-field py-2 px-4 bg-base-200 border border-base-100"
        >
            <H5Headline as="h2">
              {usp.icon} {usp.title}
            </H5Headline>
            <p className="text-xs text-grey text-center">{usp.description}</p>
          </div>
      ))}
    </div>
  )
}

export default UspHeroMobile