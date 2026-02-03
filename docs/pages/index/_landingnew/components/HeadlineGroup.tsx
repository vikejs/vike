import React, { ReactNode, useMemo } from 'react'
import cm from '@classmatejs/react'

import Headline from './Headline'
import BlurDot from './BlurDot'
import { BlurDotType } from '../util/ui.constants'

type HeadlineGroupProps = {
  main: string | ReactNode
  pre?: string | ReactNode
  centered?: boolean
  headingStyle?: 'h1' | 'h2' | 'xlarge'
  sub?: string | ReactNode
  outerClassName?: string
  blurColor?: BlurDotType
}

const HeadlineGroup = ({
  main,
  pre,
  centered = false,
  headingStyle = 'h2',
  sub,
  blurColor,
  outerClassName,
}: HeadlineGroupProps) => {
  const headlineContent = useMemo(
    () => (
      <>
        {pre && (
          <AuxHeadline $type="pre" $centered={centered || true}>
            {pre}
          </AuxHeadline>
        )}
        <BaseHeadline className={`${sub ? 'mb-3' : ''}`} as="h1" variant={headingStyle} $centered={centered || true}>
          {main}
        </BaseHeadline>
        {sub && (
          <AuxHeadline className='mb-3' $type="sub" $centered={centered || true}>
            {sub}
          </AuxHeadline>
        )}
      </>
    ),
    [pre, main, sub, centered, headingStyle],
  )

  return (
    <div role="heading" className={outerClassName}>
      {blurColor && (
        <div className="absolute inset-0 flex justify-center z-0">
          <BlurDot type={blurColor} size="lg" visibility="low" className="-mt-30" />
        </div>
      )}
      <div className="z-2 relative">{headlineContent}</div>
    </div>
  )
}

export default HeadlineGroup

const AuxHeadline = cm.p.variants<{ $centered?: boolean; $type: 'sub' | 'pre' }>({
  base: ({ $centered }) => `
    md:text-lg lg:text-xl
    text-grey-100
    my-0
    ${$centered ? 'text-center' : ''}
  `,
  variants: {
    $type: {
      pre: 'mb-1',
      sub: '',
    },
  },
})

const BaseHeadline = cm.extend(Headline)<{ $centered?: boolean }>`
  ${({ $centered }) => ($centered ? 'text-center' : '')}
`