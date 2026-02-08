import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import FlexGraphic from './FlexGraphic'
import SectionHeader from '../../components/SectionHeader'

const StabilitySection = () => {
  return (
    <LayoutComponent className="mt-20">
      <SectionHeader
        icon={'💎'}
        badgeText="Stability"
        main={
          <>
            Rock-solid <GradientText color="blue">foundation(s)</GradientText>
          </>
        }
        sub="Vike is an agnostic core you can trust and build upon with confidence — no matter what you are creating."
        color="blue"
      />
      <div className="grid grid-cols-2">
        <div></div>
        <FlexGraphic />
      </div>
    </LayoutComponent>
  )
}

export default StabilitySection
