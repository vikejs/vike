import React from 'react'
import { features } from './features'
import LayoutComponent from '../../../components/LayoutComponent'
import { H5Headline } from '../../../components/Headline'

const IsolatedFeatureWall = () => {
  return (
    <LayoutComponent className="mt-10" $size="full">
      {features.map((feature, featureIndex) => {
        const Icon = feature.icon

        return (
          <article
            className="relative flex w-64 flex-col rounded-field border border-grey-200 bg-base-100/85 p-4 sm:w-[20rem] lg:w-[22rem]"
            key={`${feature.title}-${featureIndex}`}
          >
            <div className="absolute inset-0 z-0 rounded-field bg-linear-to-t from-transparent to-base-300/45" />
            <div className="z-2 mb-6 flex items-center justify-between gap-3">
              <H5Headline as="h4" className="font-normal leading-tight">
                {feature.title}
              </H5Headline>
              <Icon aria-hidden className="h-4 w-4" strokeWidth={2.3} />
            </div>
          </article>
        )
      })}
    </LayoutComponent>
  )
}

export default IsolatedFeatureWall
