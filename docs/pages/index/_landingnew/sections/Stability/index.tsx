import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import FlexGraphic from './FlexGraphic'

const StabilitySection = () => {
  return <LayoutComponent className="mt-20">
      <HeadlineGroup
        outerClassName='sm:w-3/4 mx-auto'
        headingStyle="h1"
        pre={
          <span className="flex flex-col gap-4">
            <span className="text-8xl">💎</span>
            <span className="badge badge-sm badge-ghost mx-auto">Stability</span>
          </span>
        }
        main={
          <>
            Rock-solid <GradientText color="blue">foundation(s)</GradientText>
          </>
        }
        sub="Vike is an agnostic core you can trust and build upon with confidence — no matter what you are creating."
        blurColor='blue'
      />
      <div className="grid grid-cols-2">
        <div>
          
        </div>
        <FlexGraphic />
      </div>
    </LayoutComponent>
}

export default StabilitySection