import React from 'react'
import { features } from './features'
import { H5Headline } from '../../../components/Headline'
import LayoutComponent from '../../../components/LayoutComponent'
import useFeatureWall from './useFeatureWall'

const featureRows = Array.from({ length: 3 }, (_, rowIndex) => features.filter((_, index) => index % 3 === rowIndex))

const FeatureWall = () => {
  const { rootRef, pause, resume } = useFeatureWall()

  return (
    <LayoutComponent className="mt-10  max-w-500" $size="full">
      {/* <H2Headline as="h3" className="mb-4 text-center">
        Full-<GradientText color="orange">fledged</GradientText>
      </H2Headline> */}
      <div
        ref={rootRef}
        className="overflow-hidden"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            resume()
          }
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-base-300 via-base-300/90 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-base-300 via-base-300/90 to-transparent sm:w-20" />

        <div className="space-y-3 lg:space-y-5 pt-5">
          {featureRows.map((row, rowIndex) => (
            <div className="" key={`feature-row-${rowIndex}`}>
              <div
                className="flex w-max"
                data-feature-wall-track
                data-speed-multiplier={[1, 0.92, 1.08][rowIndex] ?? 1}
              >
                {[false, true].map((isDuplicate) => (
                  <div
                    aria-hidden={isDuplicate}
                    className="flex shrink-0 gap-3 pr-3 lg:gap-5 lg:pr-5"
                    data-feature-wall-sequence={isDuplicate ? undefined : ''}
                    key={isDuplicate ? 'duplicate' : 'primary'}
                  >
                    {row.map((feature, featureIndex) => {
                      const Icon = feature.icon

                      return (
                        <article
                          className="relative flex w-64 flex-col rounded-field border border-grey-200 bg-base-100/85 p-4 sm:w-[20rem] lg:w-[22rem]"
                          key={`${feature.title}-${featureIndex}-${isDuplicate ? 'duplicate' : 'primary'}`}
                        >
                          <div className="absolute inset-0 z-0 rounded-field bg-linear-to-t from-transparent to-base-300/45" />
                          <div className="z-2 mb-6 flex items-center justify-between gap-3">
                            <H5Headline as="h4" className="font-normal leading-tight">
                              {feature.title}
                            </H5Headline>
                            <Icon aria-hidden className="h-4 w-4" strokeWidth={2.3} />
                          </div>
                          <div className="z-2 flex flex-1 flex-col">
                            <p className="text-xs text-grey sm:text-sm [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-2">
                              {feature.content}
                            </p>
                          </div>
                          {feature.advanced && (
                            <div className="badge badge-xs badge-grey absolute right-3 -top-2 z-2 border-grey-200 text-grey">
                              Advanced
                            </div>
                          )}
                        </article>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutComponent>
  )
}

export default FeatureWall
