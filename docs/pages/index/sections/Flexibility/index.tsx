import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import FlexGraphic from './FlexGraphic'
import { ChevronsDown } from 'lucide-react'
import GlassContainer from '../../components/GlassContainer'
import libraryRollImg from '../../assets/libraryRoll.avif'
import libraryRollImgMobile from '../../assets/libraryRoll@0.5.avif'
import BlurDot from '../../components/BlurDot'
import BarChart from '../../components/BarChart'
import { H4Headline } from '../../components/Headline'
import { freedomUspImg, taglineFreedom, UspCategoryId } from '../../util/constants'
import { smoothScrollToSelector } from '../../util/gsap.utils'
import { ClosingWords } from '../Dx/DxContent'

export const textOtherFrameworks = 'Other'

const FlexibilitySection = () => {
  const onSeeUseCasesClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault()
    smoothScrollToSelector('#hooks')
  }

  return (
    <section data-usp-section={UspCategoryId.freedom}>
      <LayoutComponent>
        <SectionHeader
          iconSrc={freedomUspImg}
          badgeText="Flexibility"
          main={<GradientText color="green">Freedom</GradientText>}
          sub={taglineFreedom}
          color="green"
          outerClassName="mb-20 mt-16 md:mb-28 md:mt-37"
        />
      </LayoutComponent>
      <LayoutComponent className="md:mb-32">
        <HeadlineGroup
          headingStyle="h2"
          outerClassName="mb-6 md:mb-14"
          main={
            <>
              <GradientText color="green">Your stack, your choice</GradientText>
            </>
          }
        />
        <div className="grid md:grid-cols-2 md:gap-x-10 relative z-2">
          <div className="md:col-span-2"></div>
          <div className="relative lg:-ml-4 -mt-4 lg:-mt-9 max-w-120 md:max-w-none mx-auto select-none pointer-events-none">
            <img
              loading="lazy"
              src={libraryRollImg}
              data-speed="0.96"
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
            <div className="flex flex-col gap-0 justify-center pt-4">
              <ul className="mb-8">
                <li>
                  - <b>Any frontend</b>: React/Vue/Solid/...
                </li>
                <li>
                  - <b>Any rendering</b>: SPA/SSG/SSR/...
                </li>
                <li>
                  - <b>Any API</b>: RPC/REST/GraphQL
                </li>
                <li>
                  - <b>Any backend</b>: Hono/Express.js/Laravel/Java/...
                </li>
                <li>
                  - <b>Any deployment</b>: Self-hosted/Cloudflare/Vercel/...
                </li>
              </ul>
              <div className="">
                <H4Headline as="h3" className="mb-2 -mt-2 md:mb-3">
                  Supported <GradientText color="green">tools</GradientText>
                </H4Headline>
                <BarChart
                  pollData={[
                    { label: 'Vike', percentage: 100 },
                    { label: textOtherFrameworks, percentage: 33 },
                  ]}
                  color="green"
                />
              </div>
              <div className="">
                <H4Headline as="h3" className="mb-2 mt-6 md:mb-3 mb:mt-8">
                  Supported <GradientText color="green">stacks</GradientText>
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
        </div>
        {/* <BlurDot type="green" size="xxl" visibility="low" className="absolute -top-20 -left-60 z-0" /> */}
      </LayoutComponent>

      <div className="w-full">
        <LayoutComponent className="lg:mb-52">
          <div className="grid lg:grid-cols-5 xl:grid-cols-2 gap-0 lg:gap-10 relative z-2">
            <GlassContainer className="lg:col-span-2 xl:col-span-1">
              <div className="flex flex-col gap-0 justify-center lg:min-h-90 lg:pt-12 py-6 lg:pb-20 mt-16 lg:mt-0">
                <HeadlineGroup
                  headingStyle="h2"
                  outerClassName="mb-8"
                  centered={false}
                  main={
                    <>
                      <GradientText color="green">Powerful hooks</GradientText>
                    </>
                  }
                />
                <p className="mb-8">
                  Use powerful hooks for <b>unprecedented flexibility</b> and extensive control over tool integration,
                  data lifecycle, pre-rendering, state management, and more.
                </p>
                <div className="mt-0 mb-12">
                  <H4Headline className="mb-3">
                    Supported <GradientText color="green">use cases</GradientText>
                  </H4Headline>
                  {/*
          <p className="mb-8 text-grey">Vike supports an unmatched amount of use cases.</p>
          */}
                  <BarChart
                    className="pr-7"
                    pollData={[
                      { label: 'Vike', percentage: 100 },
                      { label: textOtherFrameworks, percentage: 33 },
                    ]}
                    color="green"
                  />
                </div>
                <p>
                  <ClosingWords href="#hooks" className="btn-primary mx-0" onClick={onSeeUseCasesClick}>
                    <ChevronsDown className="w-4 h-4" /> See use cases <ChevronsDown className="w-4 h-4" />
                  </ClosingWords>
                </p>
              </div>
            </GlassContainer>
            <div className="relative lg:col-span-3 xl:col-span-1" data-speed="0.97">
              <FlexGraphic />
            </div>
          </div>
          <BlurDot type="green" size="xxl" visibility="low" className="absolute -top-20 right-0 z-0 grayscale" />
        </LayoutComponent>
      </div>
    </section>
  )
}

export default FlexibilitySection
