import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import FlexGraphic from './FlexGraphic'
import { ChevronsRight } from 'lucide-react'
import GlassContainer from '../../components/GlassContainer'
import libraryRollImg from '../../assets/libraryRoll.webp'
import libraryRollImgMobile from '../../assets/libraryRoll@0.5.webp'
import BlurDot from '../../components/BlurDot'
import BarChart from '../../components/BarChart'
import { H3Headline, H4Headline } from '../../components/Headline'

const FlexibilitySection = () => {
  return (
    <>
      <LayoutComponent className="mt-20 ">
        <SectionHeader
          icon={'🕊️'}
          badgeText="Flexibility"
          main={
            <>
              Your stack, your <GradientText color="green">choice</GradientText>
            </>
          }
          sub="Any tools. Any API. Any backend. Any rendering. Any deployment."
          color="green"
        />
      </LayoutComponent>

      <LayoutComponent className="mt-20">
        <div className="grid grid-cols-2 gap-10 relative z-2">
          <div className="relative -ml-3">
            <img
              loading="lazy"
              src={libraryRollImg}
              alt="Library roll with various tools and frameworks"
              className="w-full h-auto hidden sm:block rounded-lg"
            />
            <img
              loading="lazy"
              src={libraryRollImgMobile}
              alt="Library roll with various tools and frameworks - mobile version"
              className="w-full h-auto sm:hidden rounded-lg"
            />
          </div>
          <GlassContainer>
            <div className="flex flex-col gap-0 justify-center min-h-90">
              <HeadlineGroup
                headingStyle="h2"
                outerClassName="mb-8"
                centered={false}
                main={
                  <>
                    <GradientText color="green">Limitless</GradientText> design
                  </>
                }
                sub="Build anything you want"
              />
              <p className="mb-8">
                Vike has <b>first-class</b> support for common architectures, and Vike's flexible design enables deep
                integration with tools — use Vike extensions for automatic integration or integrate manually for maximum
                flexibility.
              </p>
              <p>
                <a href="/docs/hooks/introduction">
                  <GradientText color="green" className="flex gap-2 items-center ">
                    Learn more about hooks <ChevronsRight className="w-4 h-4 text-primary" />
                  </GradientText>
                </a>
              </p>
            </div>
          </GlassContainer>
        </div>
        <BlurDot type="green" size="xl" visibility="low" className="absolute top-0 right-0 z-0" />
      </LayoutComponent>

      <div className="relative my-32" data-speed="0.87">
        <LayoutComponent className="grid grid-cols-2 gap-10">
          <div className="">
            <H4Headline as="h3" className="mb-8">
              Supported <GradientText color="green">tools</GradientText> (first-class support)
            </H4Headline>
            <BarChart
              pollData={[
                { label: 'other frameworks', percentage: 33 },
                { label: 'Vike', percentage: 100 },
              ]}
              color="green"
            />
          </div>
          <div className="">
            <H4Headline as="h3" className="mb-8">
              Supported <GradientText color="green">architectures</GradientText> (first-class support)
            </H4Headline>
            <BarChart
              pollData={[
                { label: 'other frameworks', percentage: 33 },
                { label: 'Vike', percentage: 100 },
              ]}
              color="green"
            />
          </div>
        </LayoutComponent>
      </div>

      <LayoutComponent className="mt-20 mb-70">
        <div className="grid grid-cols-2 gap-10 relative z-2">
          <GlassContainer>
            <div className="flex flex-col gap-0 justify-center min-h-90">
              <HeadlineGroup
                headingStyle="h2"
                outerClassName="mb-8"
                centered={false}
                main={
                  <>
                    <GradientText color="green">Powerful</GradientText> hooks
                  </>
                }
                sub="Build what you want with powerful hooks."
              />
              <p className="mb-8">Vike's comprehensive list of hooks unlocks unprecedented flexibility.</p>
              <p>
                <a href="/docs/hooks/introduction">
                  <GradientText color="green" className="flex gap-2 items-center ">
                    Learn more about hooks <ChevronsRight className="w-4 h-4 text-primary" />
                  </GradientText>
                </a>
              </p>
            </div>
          </GlassContainer>
          <div className="relative">
            <FlexGraphic />
          </div>
        </div>
        <BlurDot type="green" size="xxl" visibility="low" className="absolute top-20 -left-40 z-0" />
      </LayoutComponent>

      <LayoutComponent $size="xs" className="my-24" data-speed="0.92">
        <H3Headline className="text-center">
          Supported <GradientText color="green">use cases</GradientText>
        </H3Headline>
        <p className="mb-8 text-grey text-center">Vike's hooks support an unmatched amount of use cases.</p>
        <BarChart
          pollData={[
            { label: 'other frameworks', percentage: 20 },
            { label: 'Vike', percentage: 100 },
          ]}
          color="green"
        />
      </LayoutComponent>
    </>
  )
}

export default FlexibilitySection
