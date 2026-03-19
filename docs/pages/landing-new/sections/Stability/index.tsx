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
            sub="Vike is a stable foundation you can trust and build upon with confidence."
            color="blue"
          />
          <StableGraphic />
        </LayoutComponent>
        <LayoutComponent $size="sm" className="mt-10">
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-sm">
              <p>
                Vike is built from stable components that will remain relevant for the foreseeable future (e.g.
                SPA/SSR/SSG), making Vike a stable foundation.{' '}
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
              You can choose between stable & battle-tested stacks with unprecedented long-term support, or the
              cutting-edge with unprecedented flexibility.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 my-12 md:my-0">
            <div className="">
              <H4Headline as="h3" className="mb-2">
                <GradientText color="blue">Long-term</GradientText> support
              </H4Headline>
              <p className="mb-6">
                Vike's agnosticity is a stable foundation — use any stable stack for as long as you want.
              </p>
              <BarChart
                pollData={[
                  { label: 'Vike', percentage: 100 },
                  { label: textOtherFrameworks, percentage: 33 },
                ]}
                color="blue"
              />
            </div>
            <div className="">
              <H4Headline as="h3" className="mb-2">
                <GradientText color="blue">Cutting-edge </GradientText> support
              </H4Headline>
              <p className="mb-6">Powerful hooks provide all the flexibility you need to adopt the cutting-edge.</p>
              <BarChart
                pollData={[
                  { label: 'Vike', percentage: 100 },
                  { label: textOtherFrameworks, percentage: 33 },
                ]}
                color="blue"
              />
            </div>
          </div>
        </GlassContainer>
      </LayoutComponent>
    </section>
  )
}

export default StabilitySection
