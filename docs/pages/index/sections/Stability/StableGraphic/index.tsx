import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

const Outer = cm.div`relative mx-auto flex flex-col gap-5 md:gap-7`

const SectionFrame = cm.div.variants<{ $tone: 'ecosystem' | 'vike' }>({
  base: `
    relative
    overflow-hidden
    rounded-[2rem]
    border
    px-3 py-4
    md:px-5 md:py-5
    shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)]
  `,
  variants: {
    $tone: {
      ecosystem: 'border-accent/15 bg-linear-to-b from-white via-white to-accent/4',
      vike: 'border-secondary/15 bg-linear-to-b from-white via-white to-secondary/5',
    },
  },
})

const HooksBars = () => (
  <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center gap-8 md:gap-14">
    {[0, 1, 2].map((barIndex) => (
      <div key={barIndex} className="flex flex-col items-center gap-3 md:gap-4">
        <span className="block h-4 w-1 rounded-full bg-base-300 md:h-6" />
        <span className="block h-4 w-1 rounded-full bg-base-300 md:h-6" />
      </div>
    ))}
  </div>
)

const DecouplingDivider = () => (
  <div className="relative flex items-center justify-center py-3 md:py-4">
    <div className="absolute inset-x-0 h-px bg-base-300/70" />
    <HooksBars />
    <span className="relative rounded-full border border-base-300 bg-white/90 px-4 py-1 text-[10px] font-semibold tracking-[0.28em] text-secondary/80 shadow-xs shadow-base-300/40 md:text-xs">
      CLEAN DECOUPLING
    </span>
  </div>
)

const StableGraphic = () => {
  return (
    <Outer>
      <SectionFrame $tone="ecosystem">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <StableGraphicLegend kind="ecosystem" />
          <EcoComponents />
        </div>
      </SectionFrame>
      <DecouplingDivider />
      <SectionFrame $tone="vike">
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-28 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <VikeComponents />
          <StableGraphicLegend kind="vike" />
        </div>
      </SectionFrame>
    </Outer>
  )
}

export default StableGraphic
