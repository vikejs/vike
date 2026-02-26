import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { H2Headline, H3Headline, H4Headline } from '../../components/Headline'
import BarChart from '../../components/BarChart'
import { UspCategoryId } from '../../util/constants'
import GlassContainer from '../../components/GlassContainer'

const StabilitySection = () => {
  return (
    <section data-usp-section={UspCategoryId.stability} className="w-full">
      <div className="w-full overflow-hidden">
        <LayoutComponent>
          <SectionHeader
            icon={'💎'}
            badgeText="Stability"
            main={
              <>
                Rock-solid <GradientText color="blue">foundation(s)</GradientText>
              </>
            }
            sub="Vike is a stable foundation you can trust and build upon with confidence."
            color="blue"
          />
          <div className="grid grid-cols-2 gap-10 mt-22">
            <div aria-hidden="true" />
            <GlassContainer>
              <div className="py-12">
                <p className="mb-4">
                  Vike is built from stable components that will remain relevant for the foreseeable future (e.g.
                  SPA/SSR/SSG), making Vike a stable foundation.{' '}
                </p>
                <p>
                  Fast evolving components (e.g. RPC/GraphQL) aren't included and, instead, Vike extensions provide
                  first-class deep integrations via powerful hooks. This clear separation results in a foundation that
                  is stable as well as open to JavaScript's fast-evolving ecosystem.
                </p>
              </div>
            </GlassContainer>
          </div>
        </LayoutComponent>
      </div>
      <LayoutComponent className="grid grid-cols-2 gap-10 my-32">
        <div className="">
          <H4Headline as="h3" className="mb-2">
            <GradientText color="blue">Long-term</GradientText> support
          </H4Headline>
          <p className="mb-6">
            Vike's agnosticity is a stable foundation — use any stable stack for as long as you want.
          </p>
          <BarChart
            pollData={[
              { label: 'other frameworks', percentage: 33 },
              { label: 'Vike', percentage: 100 },
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
              { label: 'other frameworks', percentage: 33 },
              { label: 'Vike', percentage: 100 },
            ]}
            color="blue"
          />
        </div>
      </LayoutComponent>
      <LayoutComponent>
        <GlassContainer>
          <div className="grid grid-cols-2 gap-10 py-6">
            <H2Headline>
              Stable stack, or cutting edge? <br />
              Your <GradientText color="blue">choice.</GradientText>
            </H2Headline>
            <p className="mb-4">
              You can choose between stable & battle-tested stacks with unprecedented long-term support, or the
              cutting-edge with unprecedented flexibility. Learn more.
            </p>
          </div>
        </GlassContainer>
      </LayoutComponent>
    </section>
  )
}

export default StabilitySection
