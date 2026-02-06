import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import NavigationTabs from './NavigationTabs'

const FlexibilitySection = () => {
  return (
    <LayoutComponent className="mt-20">
      <SectionHeader
        icon={'🕊️'}
        badgeText="Flexibility"
        main={
          <>
            Your stack, your <GradientText color="green">choice</GradientText>
          </>
        }
        sub="Any tools. Any API. Any backend. Any rendering. Any deployment."
        color="green"
      />
      <NavigationTabs />
      <div className="grid grid-cols-2 min-h-100 bg-base-200 mt-20">
        <div>read-only editor here</div>
      </div>
    </LayoutComponent>
  )
}

export default FlexibilitySection
