export const LayoutSize = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

export type LayoutSize = (typeof LayoutSize)[keyof typeof LayoutSize]

export const FlexGraphicHookNames = {
  onBeforeRenderClient: 'onBeforeRenderClient',
  Wrapper: 'Wrapper',
  onCreatePageContext: 'onCreatePageContext',
  Head: 'Head',
  onHookCall: 'onHookCall',
  onBeforeRenderHtml: 'onBeforeRenderHtml',
  onRenderClient: 'onRenderClient',
  onCreateGlobalContext: 'onCreateGlobalContext',
  onError: 'onError',
  onRenderHtml: 'onRenderHtml',
  onAfterRenderHtml: 'onAfterRenderHtml',
} as const

export type FlexGraphicHookName = (typeof FlexGraphicHookNames)[keyof typeof FlexGraphicHookNames]

export const HOOK_COLORS: { [key in FlexGraphicHookName]: string } = {
  onBeforeRenderClient: '#E3B3D2',
  Wrapper: '#DF9058',
  onCreatePageContext: '#7ECDD3',
  Head: '#A9E248',
  onHookCall: '#F453BC',
  onBeforeRenderHtml: '#AC9C5B',
  onRenderClient: '#E26D6D',
  onCreateGlobalContext: '#537998',
  onError: '#42DE98',
  onRenderHtml: '#6FBE59',
  onAfterRenderHtml: '#F0CD42',
} as const
