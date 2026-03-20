import React from 'react'
import { Link } from '@brillout/docpress'
import GradientText from '../../components/GradientText'

function MiniPricingTeaser() {
  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-7">
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Pricing</div>
          <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-900">
            <GradientText color="green">Free</GradientText> or <GradientText color="blue">$5k one time</GradientText>
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Transparent pricing with no hidden monetization. See the full pricing page for the eligibility details and
            nuances behind each option.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PriceCard
            accentClassName="from-emerald-500/20 via-emerald-500/8 to-transparent"
            eyebrow="Option 1"
            title="Free"
            description="For small teams and eligible organizations that qualify for free usage."
          />
          <PriceCard
            accentClassName="from-blue-500/20 via-blue-500/8 to-transparent"
            eyebrow="Option 2"
            title="$5k one time"
            description="For larger teams that want a straightforward lifetime license."
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-transform hover:-translate-y-0.5 hover:text-white"
          >
            See full pricing
          </Link>
          <span className="text-xs leading-5 text-slate-500">
            All details, notes, and edge cases live on the full pricing page.
          </span>
        </div>
      </div>
    </div>
  )
}

function PriceCard({
  accentClassName,
  eyebrow,
  title,
  description,
}: {
  accentClassName: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className={`absolute inset-x-0 top-0 h-18 bg-gradient-to-b ${accentClassName}`} />
      <div className="relative">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</div>
        <div className="mt-3 text-2xl font-semibold text-slate-900">{title}</div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

export default MiniPricingTeaser
