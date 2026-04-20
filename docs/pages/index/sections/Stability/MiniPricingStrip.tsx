import React from 'react'
import { Check } from 'lucide-react'
import GradientText from '../../components/GradientText'

const columns = [
  {
    title: 'Small team',
    subtitle: '',
    price: 'Free',
    toneClassName: 'from-emerald-500/14 via-emerald-500/6 to-white/30',
    panelClassName: 'bg-emerald-50/65',
    priceColor: 'green' as const,
    suffix: undefined,
  },
  {
    title: 'Larger team',
    subtitle: 'SMALL ORG',
    price: 'Free',
    toneClassName: 'from-emerald-500/14 via-emerald-500/6 to-white/30',
    panelClassName: 'bg-emerald-50/65',
    priceColor: 'green' as const,
    suffix: undefined,
  },
  {
    title: 'Larger team',
    subtitle: 'LARGER ORG',
    price: '$5k',
    toneClassName: 'from-blue-500/16 via-violet-500/8 to-white/30',
    panelClassName: 'bg-blue-50/60',
    priceColor: 'blue' as const,
    suffix: 'ONE TIME',
  },
] as const

const trustLabels = ['100% MIT License', 'Zero investors'] as const

function MiniPricingStrip() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {trustLabels.map((label) => (
          <a
            key={label}
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[0.75rem] font-medium text-slate-600 ring-1 ring-inset ring-slate-200/70 backdrop-blur-md transition hover:bg-white hover:text-slate-900 hover:ring-slate-300"
          >
            <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} aria-hidden />
            <span style={{ position: 'relative', top: 0 }}>{label}</span>
          </a>
        ))}
      </div>
      <a
        href="/pricing"
        className="block overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/88 ring-1 ring-slate-200/70 backdrop-blur-md transition hover:ring-slate-300"
      >
        <div className="grid grid-cols-3 divide-x divide-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))]">
          {columns.map((column) => (
            <div
              key={`${column.title}-${column.subtitle}`}
              className={`relative flex min-h-42 flex-col items-center justify-center px-4 py-7 text-center md:px-6 ${column.panelClassName}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${column.toneClassName}`} />
              <div className="relative min-h-[2.8rem] text-[0.9rem] font-semibold tracking-[0.1em] text-slate-500 md:min-h-0">
                {column.title}
              </div>
              <div className="relative mt-1 flex min-h-[2.2rem] items-center text-[0.67rem] font-medium tracking-[0.16em] text-slate-400 md:block md:min-h-[1.15rem] md:leading-[1.15rem]">
                {column.subtitle || '\u00A0'}
              </div>
              <div className="relative mt-5 text-[1.7rem] font-semibold tracking-[-0.03em] md:text-[2rem]">
                <GradientText color={column.priceColor}>{column.price}</GradientText>
              </div>
              <div className="relative mt-1 flex min-h-[2rem] items-start text-[0.66rem] font-medium tracking-[0.16em] text-slate-500 md:block md:min-h-0">
                {column.suffix || '\u00A0'}
              </div>
            </div>
          ))}
        </div>
      </a>
    </div>
  )
}

export default MiniPricingStrip
