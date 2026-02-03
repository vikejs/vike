import { FlexGraphicHook } from "./constants"

export const LayoutSize = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const
export type LayoutSize = (typeof LayoutSize)[keyof typeof LayoutSize]

export const layoutComponentSizeMapping: { [key in LayoutSize]: string } = {
  xxs: 'max-w-[480px]',
  xs: 'max-w-[768px]',
  sm: 'max-w-[960px]',
  md: 'max-w-[1100px]', // 1140 base header width - 2 x 20px padding from header elements..
  lg: 'max-w-[1280px]',
} as const

export const BlurDotType = {
  blue: 'blue',
  green: 'green',
  orange: 'orange',
} as const
export type BlurDotType = (typeof BlurDotType)[keyof typeof BlurDotType]

export const GradientTextColors = {
  blue: 'blue',
  orange: 'orange',
  green: 'green',
} as const
export type GradientTextColors = (typeof GradientTextColors)[keyof typeof GradientTextColors]

export const BlurDotOpacity = {
  low: 'opacity-50',
  medium: 'opacity-70',
  high: 'opacity-100',
} as const
export type BlurDotOpacity = keyof typeof BlurDotOpacity

export const hookColors: { [key in FlexGraphicHook]: string } = {
  onBeforeRenderClient: 'var(--color-onBeforeRenderClient-hex)',
  Wrapper: 'var(--color-Wrapper-hex)',
  onCreatePageContext: 'var(--color-onCreatePageContext-hex)',
  Head: 'var(--color-Head-hex)',
  onHookCall: 'var(--color-onHookCall-hex)',
  onBeforeRenderHtml: 'var(--color-onBeforeRenderHtml-hex)',
  onRenderClient: 'var(--color-onRenderClient-hex)',
  onCreateGlobalContext: 'var(--color-onCreateGlobalContext-hex)',
  onError: 'var(--color-onError-hex)',
  onRenderHtml: 'var(--color-onRenderHtml-hex)',
  onAfterRenderHtml: 'var(--color-onAfterRenderHtml-hex)',
} as const