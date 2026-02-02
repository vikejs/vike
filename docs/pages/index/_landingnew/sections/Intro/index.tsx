import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'

const IntroSection = () => {
  return (
    <LayoutComponent $size="sm">
      <HeadlineGroup main="Build fast, Build right" headingStyle="h1" centered sub="Henllooo " />
    </LayoutComponent>
  )
}

export default IntroSection
