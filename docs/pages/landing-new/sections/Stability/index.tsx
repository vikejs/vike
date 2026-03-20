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
            sub="Clear separation between Vike and the JavaScript ecosystem — a stable foundation."
            color="blue"
          />
          <StableGraphic />
        </LayoutComponent>
        <LayoutComponent $size="sm" className="mt-3">
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-sm">
              <p>
                Vike's <b>internal components are stable features</b> that remain relevant for the foreseeable future,
                making Vike a stable foundation.{' '}
              </p>
              <p>
                <b>Fast evolving JavaScript tools aren't built into Vike by design</b> — instead, Vike extensions
                provide deep and first-class integrations via powerful hooks.
              </p>
            </div>
          </div>
        </LayoutComponent>
      </div>
      <LayoutComponent className="md:my-24">
        <GlassContainer>
          <div className="grid grid-cols-2 gap4 md:gap-10 py-6">
            <H2Headline>
              <GradientText color="blue">Stable stack</GradientText> or{' '}
              <GradientText color="green">cutting edge</GradientText>? <br />
              Your choice.
            </H2Headline>
            <p className="mb-4">
              Choose between a stable stack with unprecedented long-term support (thanks for Vike's stable foundation),
              or the cutting-edge with unprecedented flexibility (thanks to Vike's powerful hooks).
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
      <LayoutComponent className="md:my-24">
        <GlassContainer>
          <div className="grid lg:grid-cols-5 xl:grid-cols-2 gap-0 lg:gap-10 relative z-2">
            <div className="lg:col-span-2 xl:col-span-1">
              <H2Headline>
                <GradientText color="blue">Aligned interests</GradientText>
              </H2Headline>
              <p className="my-5">
                Instead of hidden monetization mechanisms, we prefer upfront and transparent pricing.
              </p>
            </div>
            <div className="relative lg:col-span-3 xl:col-span-1" data-speed="0.97">
            </div>
          </div>
        </GlassContainer>
      </LayoutComponent>
    </section>
  )
}

export default StabilitySection
