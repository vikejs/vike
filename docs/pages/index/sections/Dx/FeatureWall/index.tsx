import React from 'react'
import { features } from './features'
import { H2Headline, H5Headline } from '../../../components/Headline'
import LayoutComponent from '../../../components/LayoutComponent'

const FeatureWall = () => {
  return (
    <LayoutComponent
      id="feature-wall"
      className="mt-24 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
      $size="xl"
    >
      <H2Headline as="h3" className="mb-10 text-center col-span-full">
        Jam-packed
      </H2Headline>
      {features.map((feature, featureIndex) => {
        const Icon = feature.icon

        return (
          <article
            className="relative flex flex-col rounded-field border border-grey-200 bg-base-100/85 p-4"
            key={`${feature.title}-${featureIndex}`}
          >
            <div className="absolute inset-0 z-0 rounded-field bg-linear-to-t from-transparent to-base-300/45 pointer-events-none" />
            <div className="z-2 mb-6 flex items-center justify-between gap-3 col-span-full">
              <H5Headline as="h4" className="font-normal">
                {feature.title}
              </H5Headline>
              <Icon aria-hidden className="h-4 w-4" strokeWidth={2.3} />
            </div>
            <div className="text-sm text-grey">{feature.content}</div>
            {/* Permanently removed the `advanced` label? I think so because it doesn't re-assure the user? it's kinda "panicking" for juniors?
            {feature.advanced && (
              <div className="badge badge-xs badge-grey absolute left-3 -top-2 z-2 border-grey-200 text-grey">
                Advanced
              </div>
            )}
            */}
          </article>
        )
      })}
    </LayoutComponent>
  )
}

export default FeatureWall
