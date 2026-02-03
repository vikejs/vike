export const LayoutSize = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

export type LayoutSize = (typeof LayoutSize)[keyof typeof LayoutSize]

export const FlexGraphicHook = {
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
export type FlexGraphicHook = (typeof FlexGraphicHook)[keyof typeof FlexGraphicHook]

export const HOOK_NAME_KEYS = Object.keys(FlexGraphicHook) as FlexGraphicHook[]

export const HOOK_COLORS: { [key in FlexGraphicHook]: string } = {
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

export const ExtensionBlockVariants = {
  react: 'react',
  core: 'core',
  apollo: 'apollo',
  styledjsx: 'styledjsx',
  redux: 'redux',
  sentry: 'sentry',
} as const

export type ExtensionBlockVariants = (typeof ExtensionBlockVariants)[keyof typeof ExtensionBlockVariants]
export const EXTENSION_BLOCK_KEYS = Object.keys(ExtensionBlockVariants) as ExtensionBlockVariants[]

export const BlurDotOpacity = {
  low: 'opacity-15',
  medium: 'opacity-30',
  high: 'opacity-50',
} as const

export type BlurDotOpacity = keyof typeof BlurDotOpacity

export const EXTENSION_BLOCK_CONNECTED_HOOKS: { [key in ExtensionBlockVariants]: FlexGraphicHook[] } = {
  react: [
    FlexGraphicHook.onRenderClient,
    FlexGraphicHook.onRenderHtml,
    FlexGraphicHook.Head,
    FlexGraphicHook.onBeforeRenderClient,
    FlexGraphicHook.onAfterRenderHtml,
    FlexGraphicHook.onBeforeRenderHtml,
    FlexGraphicHook.Wrapper,
  ],
  core: [
    FlexGraphicHook.onRenderClient,
    FlexGraphicHook.onRenderHtml,
    FlexGraphicHook.onCreateGlobalContext,
    FlexGraphicHook.onError,
    FlexGraphicHook.onHookCall,
    FlexGraphicHook.onCreatePageContext,
  ],
  apollo: [FlexGraphicHook.Wrapper],
  styledjsx: [FlexGraphicHook.Wrapper, FlexGraphicHook.onBeforeRenderHtml, FlexGraphicHook.onAfterRenderHtml],
  redux: [
    FlexGraphicHook.onBeforeRenderClient,
    FlexGraphicHook.onAfterRenderHtml,
    FlexGraphicHook.Wrapper,
    FlexGraphicHook.onCreatePageContext,
  ],
  sentry: [
    FlexGraphicHook.onHookCall,
    FlexGraphicHook.onError,
    FlexGraphicHook.onCreateGlobalContext,
    FlexGraphicHook.Head,
  ],
}

