import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import BlurDot from '../../components/BlurDot'
import GradientText from '../../components/GradientText'

const IntroSection = () => {
  return (
    <LayoutComponent $size="sm">
      <HeadlineGroup
        headingStyle="h1"
        centered
        main={
          <>
            {'Build '}
            <GradientText color='blue'>
              fast.
            </GradientText>
            {' Build '}
            <GradientText startColor="#F97316" endColor="#E879F9" rotation={45}>
              right.
            </GradientText>
          </>
        }
        pre={
          <span className="inline-flex gap-2 mx-auto mb-2">
            <span className="badge badge-primary badge-sm">Replaces Next.js / Nuxt / ...</span>
            <span className="badge badge-secondary badge-sm">[Vite logo] Powered By Vite</span>
          </span>
        }
        sub={
          <span className="block w-3/5 mx-auto">
            Composable meta framework to build advanced applications with stability and flexibility.
          </span>
        }
        outerClassName="my-12"
      />
      <BlurDot type="blue" lazy={false} />
      {/* <BlurDot type="orange" />
      <BlurDot type="green" /> */}
    </LayoutComponent>
  )
}

export default IntroSection
