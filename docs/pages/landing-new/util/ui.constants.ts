import { FlexGraphicHook } from './constants'

export const uiConfig = {
  transition: {
    shortDuration: 0.15,
    shortDurationTw: 'duration-150',
    mediumDuration: 0.45,
    mediumDurationTw: 'duration-450',
    longDuration: 0.75,
    longDurationTw: 'duration-750',
    easeInTw: 'ease-in',
    easeInGsap: 'power1.in',
    easeOutTw: 'ease-out',
    easeOutGsap: 'power1.out',
    easeInOutTw: 'ease-in-out',
    easeInOutGsap: 'power1.inOut',
  },
}

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

export const BlurDotOpacity = {
  low: 'opacity-10',
  medium: 'opacity-30',
  high: 'opacity-80',
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

export const UiColorVariantKey = {
  blue: 'blue',
  green: 'green',
  orange: 'orange',
} as const
export type UiColorVariantKey = (typeof UiColorVariantKey)[keyof typeof UiColorVariantKey]
export const UiColorVariantKeys = Object.values(UiColorVariantKey) as UiColorVariantKey[]

export const UiVariantTextColor = {
  neutral: 'text-base-content',
  green: 'text-primary',
  blue: 'text-secondary',
  orange: 'text-accent',
} as const

export const UiVariantBtnColor = {
  green: 'btn-primary',
  blue: 'btn-secondary',
  orange: 'btn-accent',
} as const

export const UiVariantBgColor = {
  green: 'bg-primary',
  blue: 'bg-secondary',
  orange: 'bg-accent',
} as const

// sm	40rem (640px)	@media (width >= 40rem) { ... }
// md	48rem (768px)	@media (width >= 48rem) { ... }
// lg	64rem (1024px)	@media (width >= 64rem) { ... }
// xl	80rem (1280px)	@media (width >= 80rem) { ... }
// 2xl	96rem (1536px)	@media (width >= 96rem) { ... }

export const BreakpointMediaQueries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const
export type Breakpoint = keyof typeof BreakpointMediaQueries
