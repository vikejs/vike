import React from 'react'
import GradientText from '../../components/GradientText'

const columns = [
  {
    title: 'Small team',
    subtitle: '',
    price: 'Free',
    toneClassName: 'from-emerald-500/10 via-emerald-500/4 to-transparent',
    borderClassName: 'border-emerald-200/80',
    priceColor: 'green' as const,
  },
  {
    title: 'Larger team',
    subtitle: 'Low money',
    price: 'Free',
    toneClassName: 'from-emerald-500/10 via-emerald-500/4 to-transparent',
    borderClassName: 'border-emerald-200/80',
    priceColor: 'green' as const,
  },
  {
    title: 'Larger team',
    subtitle: 'High money',
    price: '$5k',
    toneClassName: 'from-blue-500/12 via-violet-500/5 to-transparent',
    borderClassName: 'border-blue-200/80',
    priceColor: 'blue' as const,
    suffix: 'one time',
  },
] as const

function MiniPricingStrip() {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/40 backdrop-blur-md">
      <div className="grid grid-cols-3 divide-x divide-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.88))]">
        {columns.map((column) => (
          <div
            key={`${column.title}-${column.subtitle}`}
            className="relative flex min-h-42 flex-col items-center justify-center px-4 py-7 text-center md:px-6"
          >
            <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${column.toneClassName}`} />
            <div
              className={`absolute inset-y-5 inset-x-3 rounded-[1.15rem] border ${column.borderClassName} bg-white/72`}
            />
            <div className="relative text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {column.title}
            </div>
            <div className="relative mt-1 min-h-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-slate-400">
              {column.subtitle || '\u00A0'}
            </div>
            <div className="relative mt-5 text-[1.7rem] font-semibold tracking-[-0.03em] md:text-[2rem]">
              <GradientText color={column.priceColor}>{column.price}</GradientText>
            </div>
            <div className="relative mt-1 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-slate-400">
              {column.suffix || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MiniPricingStrip
