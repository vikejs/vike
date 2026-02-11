import React, { HTMLAttributes } from 'react'
import { createVariantMap, type CmBaseComponent, type VariantsConfig } from '@classmatejs/react'

// 1. setup accepted elements and types
const headlineLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
type HeadlineLevels = (typeof headlineLevels)[number]

const additionalElements = ['p'] as const
type AdditionalHeadlineTypes = (typeof additionalElements)[number]

type RcVariantType = HeadlineLevels | 'p' | 'xlarge'

// 1. Setup Accepted Elements and Types
interface HeadlineVariantProps extends HTMLAttributes<HTMLElement> {
  $as?: RcVariantType
}
const headlineVariants: VariantsConfig<HeadlineVariantProps, HeadlineVariantProps> = {
  base: '',
  variants: {
    $as: {
      xlarge: 'text-4xl! md:text-5xl! xl:text-7xl!',
      h1: 'text-3xl! md:text-4xl! xl:text-5xl!',
      h2: 'text-2xl! md:text-3xl! xl:text-4xl!',
      h3: 'text-xl! md:text-2xl! xl:text-3xl ',
      h4: 'text-lg! xl:text-xl!',
      h5: 'text-lg! ',
      h6: 'text-base ',
      p: 'text-base',
    },
  },
}

// 3. create variant map
const hVariantMap: Record<string, CmBaseComponent<HeadlineVariantProps>> = createVariantMap({
  elements: [...additionalElements, ...headlineLevels],
  variantsConfig: headlineVariants,
})

// 4 define the react component
// due large variety of elements, we just type for "HTMLAttributes<HTMLElement>" - adjust as needed
interface HeadlineProps extends HTMLAttributes<HTMLElement> {
  variant?: RcVariantType
  as: Exclude<RcVariantType, 'p'> | AdditionalHeadlineTypes
}
const Headline = ({ as, variant, ...props }: HeadlineProps) => {
  const isHeadline = headlineLevels.includes(as as HeadlineLevels)
  const variantToUse = variant || (isHeadline ? (as as RcVariantType) : 'p')

  const Component = hVariantMap[as] || null

  return (
    <Component $as={variantToUse} {...props}>
      {props.children}
    </Component>
  )
}

// 5. create convenience components
type HeadlineComponentProps = { as?: HeadlineProps['as'] } & HTMLAttributes<HTMLElement>
const createHeadlineComponent = (level: HeadlineLevels) => {
  return ({ as = level, ...props }: HeadlineComponentProps) => (
    <Headline as={as} {...(as !== level ? { variant: level } : {})} {...props} />
  )
}

// 6. export(s)
export const H1Headline = createHeadlineComponent('h1')
export const H2Headline = createHeadlineComponent('h2')
export const H3Headline = createHeadlineComponent('h3')
export const H4Headline = createHeadlineComponent('h4')
export const H5Headline = createHeadlineComponent('h5')
export const H6Headline = createHeadlineComponent('h6')
export default Headline
