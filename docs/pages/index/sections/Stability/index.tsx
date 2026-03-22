import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { H2Headline, H4Headline } from '../../components/Headline'
import BarChart from '../../components/BarChart'
import { stabilityUspImg, UspCategoryId } from '../../util/constants'
import GlassContainer from '../../components/GlassContainer'
import StableGraphic from './StableGraphic'
import { textOtherFrameworks } from '../Flexibility'
import MiniPricingStrip from './MiniPricingStrip'
import { ChevronsRight } from 'lucide-react'
import { ClosingWords } from '../Dx/DxContent'
import { cmMerge } from '@classmatejs/react'

const verticalPaddingClass = 'py-12 md:py-14'

const StabilitySection = () => {
  return (
    <section data-usp-section={UspCategoryId.stability} className="w-full">
      <div className="w-full">
        <LayoutComponent>
          <SectionHeader
            iconSrc={stabilityUspImg}
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
        <LayoutComponent $size="sm" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-sm">
          <p>
            Vike's <b>internal components are stable features</b> that remain relevant for the foreseeable future,
            making Vike a stable foundation.{' '}
          </p>
          <p>
            <b>Fast evolving JavaScript tools aren't built into Vike by design</b> — instead, Vike extensions provide
            deep and first-class integrations via powerful hooks.
          </p>
        </LayoutComponent>
      </div>
      <LayoutComponent className="md:my-24 relative">
        <div className={cmMerge('grid md:grid-cols-2 gap-4 md:gap-10 py-0', verticalPaddingClass)}>
          <GlassContainer className={cmMerge('w-1/2 right-0 h-[120%] absolute z-0 -translate-y-[20%]')} />
          <H2Headline className="z-2 relative">
            <GradientText color="blue">Stable stack</GradientText> or{' '}
            <GradientText color="green">cutting edge</GradientText>? <br />
            Your choice.
          </H2Headline>
          <p className="mb-4 z-2 ">
            Choose between a stable stack with unmatched long-term support (thanks to Vike's stable foundation), or the
            cutting-edge with unprecedented flexibility (thanks to Vike's powerful hooks).
          </p>
          <div className="relative z-2">
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
          <div className="relative z-2">
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
      </LayoutComponent>
      <LayoutComponent className="md:mb-44 md:mt-32">
        <div className="grid lg:grid-cols-2">
          <GlassContainer>
            <div className={verticalPaddingClass}>
              <H2Headline>
                <GradientText color="blue">Stable interests</GradientText>
              </H2Headline>
              <p className="my-5">
                Upfront and transparent pricing you can trust, instead of hidden monetization lock-in mechanisms.
              </p>
              <p className="my-5">It's the guarantee Vike's interests are and remain aligned with yours.</p>
              <p>
                <ClosingWords href="/pricing" className="btn-secondary mx-0">
                  See pricing <ChevronsRight className="w-4 h-4 mt-[1px]" />
                </ClosingWords>
              </p>
            </div>
          </GlassContainer>
          <div className={cmMerge(verticalPaddingClass, 'relative lg:pl-4')} data-speed="0.97">
            <MiniPricingStrip />
          </div>
        </div>
      </LayoutComponent>
    </section>
  )
}

export default StabilitySection
