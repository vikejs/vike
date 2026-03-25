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

const HooksBridge = () => (
  <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
    <svg
      viewBox="0 0 720 96"
      aria-hidden="true"
      className="h-20 w-full max-w-4xl overflow-visible md:h-24"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="hooks-bridge-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgb(251 146 60 / 0.45)" />
          <stop offset="50%" stopColor="rgb(148 163 184 / 0.28)" />
          <stop offset="100%" stopColor="rgb(96 165 250 / 0.45)" />
        </linearGradient>
      </defs>
      {[
        { startX: 120, endX: 250, midX: 200 },
        { startX: 360, endX: 360, midX: 360 },
        { startX: 600, endX: 470, midX: 520 },
      ].map(({ startX, endX, midX }) => (
        <g key={`${startX}-${endX}`}>
          <path
            d={`M ${startX} 10 C ${startX} 28 ${midX} 26 ${midX} 40`}
            fill="none"
            stroke="url(#hooks-bridge-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${midX} 56 C ${midX} 70 ${endX} 68 ${endX} 86`}
            fill="none"
            stroke="url(#hooks-bridge-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={startX} cy="10" r="4" fill="rgb(251 146 60 / 0.7)" />
          <circle cx={endX} cy="86" r="4" fill="rgb(96 165 250 / 0.7)" />
          <circle cx={midX} cy="40" r="3" fill="rgb(251 146 60 / 0.35)" />
          <circle cx={midX} cy="56" r="3" fill="rgb(96 165 250 / 0.35)" />
        </g>
      ))}
    </svg>
  </div>
)

const DecouplingDivider = () => (
  <div className="relative flex items-center justify-center py-3 md:py-4">
    <div className="absolute inset-x-0 h-px bg-linear-to-r from-accent/0 via-base-300 to-secondary/0" />
    <HooksBridge />
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
