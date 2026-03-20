import React from 'react'
import GradientText from '../../components/GradientText'

const columns = [
  {
    title: 'Small team',
    subtitle: '',
    price: 'Free',
    toneClassName: 'from-emerald-500/14 via-emerald-500/6 to-white/70',
    panelClassName: 'bg-emerald-50/65',
    priceColor: 'green' as const,
  },
  {
    title: 'Larger team',
    subtitle: 'Low resources',
    price: 'Free',
    toneClassName: 'from-emerald-500/14 via-emerald-500/6 to-white/70',
    panelClassName: 'bg-emerald-50/65',
    priceColor: 'green' as const,
  },
  {
    title: 'Larger team',
    subtitle: 'High resources',
    price: '$5k',
    toneClassName: 'from-blue-500/16 via-violet-500/8 to-white/70',
    panelClassName: 'bg-blue-50/60',
    priceColor: 'blue' as const,
    suffix: 'one time',
  },
] as const

function MiniPricingStrip() {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/40 backdrop-blur-md">
      <div className="grid grid-cols-3 divide-x divide-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))]">
        {columns.map((column) => (
          <div
            key={`${column.title}-${column.subtitle}`}
            className={`relative flex min-h-42 flex-col items-center justify-center px-4 py-7 text-center md:px-6 ${column.panelClassName}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${column.toneClassName}`} />
            <div className="relative text-[0.9rem] font-semibold tracking-[0.1em] text-slate-500">{column.title}</div>
            <div className="relative mt-1 min-h-4 text-[0.67rem] font-medium uppercase tracking-[0.16em] text-slate-400 whitespace-nowrap">
              {column.subtitle || '\u00A0'}
            </div>
            <div className="relative mt-5 text-[1.7rem] font-semibold tracking-[-0.03em] md:text-[2rem]">
              <GradientText color={column.priceColor}>{column.price}</GradientText>
            </div>
            <div className="relative mt-1 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-slate-500">
              {column.suffix || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MiniPricingStrip
