import React, { ReactNode } from 'react'
import cm from '@classmatejs/react'

import { Headline } from './Headline'

const AuxHeadline = cm.p.variants<{ $centered?: boolean; $type: 'sub' | 'pre' }>({
  base: ({ $centered }) => `
    text-lg 
    text-gray
    lg:text-xl
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

type HeadlineGroupProps = {
  main: string | ReactNode
  pre?: string | ReactNode
  centered?: boolean
  headingStyle?: 'h1' | 'h2'
  sub?: string | ReactNode
  outerClassName?: string
}

const HeadlineGroup = ({
  main,
  pre,
  centered = false,
  headingStyle = 'h2',
  sub,
  outerClassName,
}: HeadlineGroupProps) => (
  <div role="heading" className={outerClassName}>
    {pre && (
      <AuxHeadline $type="pre" $centered={centered || true}>
        {pre}
      </AuxHeadline>
    )}
    <BaseHeadline className={`${sub ? 'mb-2' : ''}`} as="h1" variant={headingStyle} $centered={centered || true}>
      {main}
    </BaseHeadline>
    {sub && (
      <AuxHeadline $type="sub" $centered={centered || true}>
        {sub}
      </AuxHeadline>
    )}
  </div>
)

export default HeadlineGroup
