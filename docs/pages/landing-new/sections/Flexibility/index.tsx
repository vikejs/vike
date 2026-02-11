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

      <LayoutComponent className="my-20">
        <div className="grid grid-cols-2 gap-10">
          <div className="relative -ml-3">
            <img
              loading='lazy'
              src={libraryRollImg}
              alt="Library roll with various tools and frameworks"
              className="w-full h-auto hidden sm:block rounded-lg"
            />
            <img
              loading='lazy'
              src={libraryRollImgMobile}
              alt="Library roll with various tools and frameworks - mobile version"
              className="w-full h-auto sm:hidden rounded-lg"
            />
          </div>
          <GlassContainer>
            <div className="flex flex-col gap-0 justify-center min-h-90">
              <HeadlineGroup
                headingStyle="h1"
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
                That’s it. We focus on that, so you as the user and also vike developers share access to the same vast
                hook-driven ecosystem. Vike behaves the same, only the perspective changes.
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
      </LayoutComponent>

      <LayoutComponent className="mt-20 mb-90">
        <div className="grid grid-cols-2 gap-10">
          <GlassContainer>
            <div className="flex flex-col gap-0 justify-center min-h-90">
              <HeadlineGroup
                headingStyle="h1"
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
                That’s it. We focus on that, so you as the user and also vike developers share access to the same vast
                hook-driven ecosystem. Vike behaves the same, only the perspective changes.
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
          <div className="relative">
            <FlexGraphic />
          </div>
        </div>
      </LayoutComponent>
    </>
  )
}

export default FlexibilitySection
