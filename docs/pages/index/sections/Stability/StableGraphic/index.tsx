import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

const Outer = cm.div`relative mx-auto`

const SectionFrame = cm.div.variants<{ $tone: 'ecosystem' | 'vike' }>({
  base: `
    relative
    overflow-hidden
    rounded-[2rem]
    border
    px-2.5 py-2.5
    md:px-4 md:py-3
  `,
  variants: {
    $tone: {
      ecosystem: 'border-accent/15 bg-linear-to-b from-white via-white to-accent/4',
      vike: 'border-secondary/15 bg-linear-to-b from-white via-white to-secondary/5',
    },
  },
})

const DecouplingDivider = () => (
  <div className="relative flex items-center justify-center h-10 md:h-13">
    <div className="absolute inset-0 flex items-stretch justify-center gap-3.5 py-0 md:gap-12">
      {Array.from({ length: 10 }, (_, barIndex) => barIndex).map((barIndex) => (
        <span
          key={barIndex}
          className="h-full w-3.5 md:w-4.5"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #d8d8d8 0%, #d8d8d8 100%), linear-gradient(to right, #d8d8d8 0%, #d8d8d8 100%)',
            backgroundPosition: 'center top, center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '4px 100%, 18px 4px',
          }}
        />
      ))}
    </div>
  </div>
)

const EcosystemSection = () => (
  <SectionFrame $tone="ecosystem">
    <div className="pointer-events-none absolute inset-x-8 top-0 h-18 rounded-full bg-accent/10 blur-3xl" />
    <div className="relative z-10">
      <EcoComponents />
    </div>
  </SectionFrame>
)

const VikeSection = () => (
  <SectionFrame $tone="vike">
    <div className="pointer-events-none absolute inset-x-10 bottom-0 h-20 rounded-full bg-secondary/10 blur-3xl" />
    <div className="relative z-10">
      <VikeComponents />
    </div>
  </SectionFrame>
)

const StableGraphic = () => {
  return (
    <Outer>
      <div className="grid gap-2 md:hidden">
        <div className="grid gap-1.5">
          <StableGraphicLegend kind="ecosystem" />
          <StableGraphicLegend kind="hooks" />
          <StableGraphicLegend kind="vike" />
        </div>
        <EcosystemSection />
        <DecouplingDivider />
        <VikeSection />
      </div>

      <div className="hidden md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-4">
        <div className="col-start-1 row-start-1 flex items-center">
          <StableGraphicLegend kind="ecosystem" />
        </div>
        <div className="col-start-2 row-start-1">
          <EcosystemSection />
        </div>

        <div className="col-start-1 row-start-2 flex items-center">
          <StableGraphicLegend kind="hooks" />
        </div>
        <div className="col-start-2 row-start-2">
          <DecouplingDivider />
        </div>

        <div className="col-start-1 row-start-3 flex items-center">
          <StableGraphicLegend kind="vike" />
        </div>
        <div className="col-start-2 row-start-3">
          <VikeSection />
        </div>
      </div>
    </Outer>
  )
}

export default StableGraphic
