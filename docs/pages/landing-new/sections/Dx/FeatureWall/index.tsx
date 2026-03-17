import React from 'react'
import { features } from './features'
import { H2Headline, H5Headline } from '../../../components/Headline'
import LayoutComponent from '../../../components/LayoutComponent'
import GradientText from '../../../components/GradientText'

const FeatureWall = () => {
  return (
    <LayoutComponent className="grid gap-3 lg:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" $size="xl">
      <H2Headline as="h3" className="col-span-full mb-4 mt-10 text-center">
        Full-<GradientText color="orange">fledged</GradientText>
      </H2Headline>
      {features.map((feature) => {
        const Icon = feature.icon

        return (
          <div
            key={feature.title}
            className="relative rounded-field border border-grey-200 p-4 bg-base-200 flex flex-col"
          >
            <div className="absolute inset-0 bg-linear-to-t to-base-300/50 z-0 rounded-field"></div>
            <div className="mb-3 flex items-center justify-between gap-3 z-2">
              <H5Headline as="h4" className="font-normal leading-tight">
                {feature.title}
              </H5Headline>
              <div className="flex size-9 shrink-0 items-center justify-center">
                <Icon aria-hidden className="w-4 h-4" strokeWidth={2.3} />
              </div>
            </div>
            <div className="flex flex-1 flex-col z-2">
              <p className="text-xs sm:text-sm text-grey [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2">
                {feature.content}
              </p>
            </div>
            {feature.advanced && (
              <div className="badge badge-xs badge-neutral absolute -bottom-2 right-3 z-2">
                Advanced
              </div>
            )}
          </div>
        )
      })}
    </LayoutComponent>
  )
}

export default FeatureWall
