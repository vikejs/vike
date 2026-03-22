import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { lightningDxUspImg, UspCategoryId } from '../../util/constants'
import DxContent from './DxContent'
import FeatureWall from './FeatureWall'

const DxSection = () => {
  return (
    <section data-usp-section={UspCategoryId.lightningDx} className="pb-20">
      <LayoutComponent>
        <SectionHeader
          iconSrc={lightningDxUspImg}
          badgeText="Developer Experience"
          main={
            <>
              <GradientText color="orange">Lightning DX</GradientText>
            </>
          }
          color="orange"
        />
        <DxContent />
      </LayoutComponent>
      <FeatureWall />
    </section>
  )
}

export default DxSection
