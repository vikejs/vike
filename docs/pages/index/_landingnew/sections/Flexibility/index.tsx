import React from 'react'

import FlexGraphic from './FlexGraphic'
import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'

const FlexibilitySection = () => {
  return (
    <LayoutComponent className="mt-20">
      <HeadlineGroup
        headingStyle="h1"
        pre={
          <span className="flex flex-col gap-4">
            <span className="text-8xl">🕊️</span>
            <span className="badge badge-sm badge-ghost mx-auto">Flexibility</span>
          </span>
        }
        main={
          <>
            Your stack, your <GradientText color="green">choice</GradientText>
          </>
        }
        sub="Any tools. Any API. Any backend. Any rendering. Any deployment."
        blurColor='green'
      />
      <div className="grid grid-cols-2">
        <div>
          
        </div>
        <FlexGraphic />
      </div>
    </LayoutComponent>
  )
}

export default FlexibilitySection
