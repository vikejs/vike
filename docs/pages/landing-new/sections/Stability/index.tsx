import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { H2Headline, H3Headline, H4Headline } from '../../components/Headline'
import BarChart from '../../components/BarChart'
import { UspCategoryId } from '../../util/constants'
import GlassContainer from '../../components/GlassContainer'
import StableGraphic from './StableGraphic'
import { textOtherFrameworks } from '../Flexibility'

const StabilitySection = () => {
  return (
    <section data-usp-section={UspCategoryId.stability} className="w-full">
      <div className="w-full">
        <LayoutComponent>
          <SectionHeader
            icon={'💎'}
            badgeText="Stability"
            main={
              <>
                <GradientText color="blue">Stable foundation</GradientText>
              </>
            }
            sub="Vike is a stable foundation you can build upon with confidence."
            color="blue"
          />
          <StableGraphic />
        </LayoutComponent>
        <LayoutComponent $size="sm" className="mt-3">
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-sm">
              <p>
                Vike's <b>internal components are stable features</b> that will remain relevant for the foreseeable
                future, making Vike a stable foundation.{' '}
              </p>
              <p>
                Fast evolving components (e.g. RPC/GraphQL) aren't included and, instead, Vike extensions provide
                first-class deep integrations via powerful hooks. This clear separation results in a foundation that is
                stable as well as open to JavaScript's fast-evolving ecosystem.
              </p>
            </div>
          </div>
        </LayoutComponent>
      </div>
      <LayoutComponent className="md:my-24">
        <GlassContainer>
          <div className="grid grid-cols-2 gap4 md:gap-10 py-6">
            <H2Headline>
              Stable stack, or cutting edge? <br />
              Your <GradientText color="blue">choice.</GradientText>
            </H2Headline>
            <p className="mb-4">
              Choose between a stable stack with unprecedented long-term support (thanks for Vike's agnostic
              foundation), or the cutting-edge with unprecedented flexibility (thanks to powerful hooks).
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 my-12 md:my-0">
            <div className="">
              <H4Headline as="h3" className="mb-7">
                <GradientText color="blue">Legacy</GradientText> support
              </H4Headline>
              <BarChart
                pollData={[
                  { label: 'Vike', percentage: 100 },
                  { label: textOtherFrameworks, percentage: 33 },
                ]}
                color="blue"
              />
            </div>
            <div className="">
              <H4Headline as="h3" className="mb-7">
                <GradientText color="green">Cutting-edge </GradientText> support
              </H4Headline>
              <BarChart
                pollData={[
                  { label: 'Vike', percentage: 100 },
                  { label: textOtherFrameworks, percentage: 33 },
                ]}
                color="green"
              />
            </div>
          </div>
        </GlassContainer>
      </LayoutComponent>
    </section>
  )
}

export default StabilitySection
