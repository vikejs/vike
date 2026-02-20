import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import { H4Headline } from '../../components/Headline'
import BarChart from '../../components/BarChart'

const StabilitySection = () => {
  return (
    <>
      <LayoutComponent className="mt-40">
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
          <p>
            Vike is agnostic to the JavaScript ecosystem — it only depends on Vite (all other dependencies are minor
            utilities). This clear separation of concerns between Vike and the ecosystem gives you a foundation that is
            stable as well as open to JavaScript's future.
          </p>
        </div>
      </LayoutComponent>
      <LayoutComponent className="my-32 grid grid-cols-2 gap-10">
        <div className="">
          <H4Headline as="h3" className="mb-8">
            Supported <GradientText color="blue">tools</GradientText> (first-class support)
          </H4Headline>
          <BarChart
            pollData={[
              { label: 'other frameworks', percentage: 33 },
              { label: 'Vike', percentage: 100 },
            ]}
            color="blue"
          />
        </div>
        <div className="">
          <H4Headline as="h3" className="mb-8">
            Supported <GradientText color="blue">architectures</GradientText> (first-class support)
          </H4Headline>
          <BarChart
            pollData={[
              { label: 'other frameworks', percentage: 33 },
              { label: 'Vike', percentage: 100 },
            ]}
            color="blue"
          />
        </div>
      </LayoutComponent>
    </>
  )
}

export default StabilitySection
