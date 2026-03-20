import React from 'react'

const columns = [
  { title: 'Small team', subtitle: '', price: 'Free', accentClassName: 'text-emerald-600' },
  { title: 'Larger team', subtitle: 'Low money', price: 'Free', accentClassName: 'text-emerald-600' },
  { title: 'Larger team', subtitle: 'High money', price: '$5k', accentClassName: 'text-blue-600', suffix: 'one time' },
] as const

function MiniPricingStrip() {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="grid grid-cols-3 divide-x divide-slate-200/80">
        {columns.map((column) => (
          <div
            key={`${column.title}-${column.subtitle}`}
            className="flex min-h-40 flex-col items-center justify-center px-4 py-6 text-center md:px-6"
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {column.title}
            </div>
            <div className="mt-1 min-h-4 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-400">
              {column.subtitle || '\u00A0'}
            </div>
            <div className={`mt-5 text-2xl font-semibold md:text-3xl ${column.accentClassName}`}>{column.price}</div>
            <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-slate-400">
              {column.suffix || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MiniPricingStrip
