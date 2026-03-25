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
import { freedomUspImg, taglineFreedom, UspCategoryId } from '../../util/constants'
import { smoothScrollToSelector } from '../../util/gsap.utils'
import { ClosingWords } from '../Dx/DxContent'

export const textOtherFrameworks = 'Other'

const FlexibilitySection = () => {
  const onSeeUseCasesClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    smoothScrollToSelector('#hooks')
  }

  const chevronsDown = <ChevronsDown className="w-4 h-4 mt-[2px]" />

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
            <div className="flex flex-col gap-0 justify-center pt-3">
              <ul className="mb-8 list-disc pl-4">
                <li>
                  <b>Any frontend</b>: React/Vue/Solid/...
                </li>
                <li>
                  <b>Any rendering</b>: SPA/SSG/SSR/...
                </li>
                <li>
                  <b>Any API</b>: RPC/REST/GraphQL
                </li>
                <li>
                  <b>Any backend</b>: Hono/Express.js/Laravel/Java/...
                </li>
                <li>
                  <b>Any deployment</b>: Self-hosted/Cloudflare/Vercel/...
                </li>
              </ul>
              <div className="">
                <BarChart
                  className="-mt-2"
                  label={
                    <>
                      Supported <GradientText color="green">tools</GradientText>
                    </>
                  }
                  pollData={[
                    { label: 'Vike', percentage: 100 },
                    { label: textOtherFrameworks, percentage: 33 },
                  ]}
                  color="green"
                />
              </div>
              <div className="">
                <BarChart
                  className="mt-6 md:mt-8"
                  label={
                    <>
                      Supported <GradientText color="green">stacks</GradientText>
                    </>
                  }
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
                  outerClassName="mb-5"
                  centered={false}
                  main={
                    <>
                      <GradientText color="green">Powerful hooks</GradientText>
                    </>
                  }
                />
                <p>
                  Use powerful hooks for <b>unprecedented flexibility</b> and extensive control over tool integration,
                  data lifecycle, pre-rendering, state management, and more.
                </p>
                <p className="my-5">
                  Hooks unlock unprecedented deep integrations — use them directly for maximum control, or via Vike
                  extensions such as <code>vike-react</code> and <code>vike-react-apollo</code> for zero-config
                  integration.
                </p>
                <div className="mt-1 mb-9">
                  {/*
          <p className="mb-8 text-grey">Vike supports an unmatched amount of use cases.</p>
          */}
                  <BarChart
                    className="pr-7"
                    label={
                      <>
                        Supported <GradientText color="green">use cases</GradientText>
                      </>
                    }
                    pollData={[
                      { label: 'Vike', percentage: 100 },
                      { label: textOtherFrameworks, percentage: 33 },
                    ]}
                    color="green"
                  />
                </div>
                <p>
                  <ClosingWords href="#hooks" className="btn-primary mx-0" onClick={onSeeUseCasesClick}>
                    {chevronsDown} See use cases {chevronsDown}
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
