import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { UspCategoryId } from '../../util/constants'
import DxContent from './DxContent.mdx'

const DxSection = () => {
  return (
    <section data-usp-section={UspCategoryId.lightningDx}>
      <LayoutComponent>
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
        <div className="min-h-2500"><DxContent /></div>
      </LayoutComponent>
    </section>
  )
}

export default DxSection
