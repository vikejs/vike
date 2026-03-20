import React from 'react'
import { Link } from '@brillout/docpress'

const pricingRows = [
  { label: 'Best for', free: 'Small / eligible', paid: 'Larger teams' },
  { label: 'Access', free: 'Full', paid: 'Full' },
  { label: 'Terms', free: 'Forever', paid: 'Lifetime' },
] as const

function MiniPricingTeaser() {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 md:px-6">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Pricing</div>
        <Link
          href="/pricing"
          className="text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-900"
        >
          See full pricing
        </Link>
      </div>

      <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)] text-sm">
        <Cell className="border-b border-r border-slate-200/80 bg-slate-50/70" />
        <HeaderCell
          className="border-b border-r border-slate-200/80"
          accentClassName="bg-emerald-500/10 text-emerald-700"
          title="Free"
        />
        <HeaderCell
          className="border-b border-slate-200/80"
          accentClassName="bg-blue-500/10 text-blue-700"
          title="$5k one time"
        />

        {pricingRows.map((row, index) => {
          const isLastRow = index === pricingRows.length - 1
          const rowBorder = isLastRow ? '' : 'border-b border-slate-200/80'

          return (
            <React.Fragment key={row.label}>
              <LabelCell className={`border-r border-slate-200/80 ${rowBorder}`}>{row.label}</LabelCell>
              <ValueCell className={`border-r border-slate-200/80 ${rowBorder}`}>{row.free}</ValueCell>
              <ValueCell className={rowBorder}>{row.paid}</ValueCell>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function HeaderCell({
  title,
  accentClassName,
  className,
}: {
  title: string
  accentClassName: string
  className?: string
}) {
  return (
    <Cell className={`px-4 py-4 md:px-5 ${className || ''}`}>
      <div className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${accentClassName}`}>
        {title}
      </div>
    </Cell>
  )
}

function LabelCell({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <Cell className={`bg-slate-50/70 font-medium text-slate-500 ${className || ''}`}>{children}</Cell>
}

function ValueCell({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <Cell className={`font-medium text-slate-900 ${className || ''}`}>{children}</Cell>
}

function Cell({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-4 py-3 md:px-5 ${className || ''}`}>{children}</div>
}

export default MiniPricingTeaser
