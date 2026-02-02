import React, { HTMLAttributes } from 'react'

import { type CmBaseComponent, createVariantMap } from '@classmatejs/react'

const headlineLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
type HeadlineLevels = (typeof headlineLevels)[number]
const extraElements = ['p'] as const

const headlineVariants = {
  variants: {
    $as: {
      h1: 'text-4xl! md:text-5xl lg:text-6xl! font-bold',
      h2: 'text-4xl! md:text-5xl font-bold ',
      h3: 'text-3xl! font-bold',
      h4: 'text-2xl! font-bold',
      h5: 'text-xl! font-bold ',
      h6: 'text-lg! font-bold ',
      p: 'text-base!',
      xlarge: 'text-7xl! lg:text-8xl! xl:text-9xl! font-black',
    },
  },
  defaultVariants: {
    $as: 'p',
  },
}

const headlineElements = [...headlineLevels, ...extraElements] as const

type HeadlineElement = HeadlineLevels | (typeof extraElements)[number]
type HeadlineVariant = HeadlineElement | 'xlarge'

interface HeadlineBaseProps extends HTMLAttributes<HTMLElement> {
  $as?: HeadlineVariant
}

const headlineMap = createVariantMap<HeadlineElement>({
  elements: headlineElements,
  variantsConfig: headlineVariants,
}) as Record<HeadlineElement, CmBaseComponent<HeadlineBaseProps>>
// Primary component: pick the HTML tag + variant classes
interface HeadlineProps extends HeadlineBaseProps {
  as?: HeadlineElement
  variant?: HeadlineVariant
}
export const Headline = (props: HeadlineProps) => {
  const as = props.as ?? 'p'
  const variant = props.variant ?? as
  const Component = headlineMap[as] ?? headlineMap.p

  return (
    <Component $as={variant} {...props}>
      {props.children}
    </Component>
  )
}

// Convenience exports (H1Headline, etc.)
type HeadlineComponentProps = Omit<HeadlineProps, 'as'> & { as?: HeadlineProps['as'] }
const createHeadlineComponent = (level: HeadlineLevels) => {
  return (props: HeadlineComponentProps) => (
    <Headline as={props.as ?? level} variant={props.as ? level : undefined} {...props} />
  )
}

export const H1Headline = createHeadlineComponent('h1')
export const H2Headline = createHeadlineComponent('h2')
export const H3Headline = createHeadlineComponent('h3')
export const H4Headline = createHeadlineComponent('h4')
export const H5Headline = createHeadlineComponent('h5')
export const H6Headline = createHeadlineComponent('h6')
