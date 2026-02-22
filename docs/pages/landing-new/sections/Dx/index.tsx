import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { UspCategoryId } from '../../util/constants'

const DxSection = () => {
  return (
    <section data-usp-section={UspCategoryId.lightningDx}>
      <LayoutComponent className="mt-20">
        <SectionHeader
          icon={'⚡️'}
          badgeText="Developer Experience"
          main={
            <>
              <GradientText color="orange">Lightning</GradientText> DX
            </>
          }
          sub="Build mission-critical apps — on a rock-solid foundation."
          color="orange"
        />
        <div className="grid grid-cols-2 min-h-300 bg-base-200 mt-20">
          <div>read-only editor here</div>
        </div>
      </LayoutComponent>
    </section>
  )
}

export default DxSection
