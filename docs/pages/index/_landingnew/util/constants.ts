import { BlurDotType } from './ui.constants'

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

export const ExtensionBlockVariants = {
  react: 'react',
  core: 'core',
  apollo: 'apollo',
  styledjsx: 'styledjsx',
  redux: 'redux',
  sentry: 'sentry',
} as const

export type ExtensionBlockVariants = (typeof ExtensionBlockVariants)[keyof typeof ExtensionBlockVariants]
export const extensionBlockKeys = Object.keys(ExtensionBlockVariants) as ExtensionBlockVariants[]

export const extensionBlockConnectedHooks: { [key in ExtensionBlockVariants]: FlexGraphicHook[] } = {
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

const UspCategoryId = {
  freedom: 'freedom',
  stability: 'stability',
  lightningDx: 'lightning-dx',
} as const
type UspId = (typeof UspCategoryId)[keyof typeof UspCategoryId]

type Usp = {
  id: UspId
  title: string
  description: string
  icon: string
  dotColor: BlurDotType
}

export const landingPageHeroUsps: Usp[] = [
  {
    id: UspCategoryId.freedom,
    title: 'Freedom',
    description: 'Small dummy text for usps. Small dummy text for.',
    icon: '🕊️',
    dotColor: 'green',
  },
  {
    id: UspCategoryId.stability,
    title: 'Stability',
    description: 'Small dummy text for usps. Small dummy text for usps. Henlo',
    icon: '💎',
    dotColor: 'blue',
  },
  {
    id: UspCategoryId.lightningDx,
    title: 'Lightning DX',
    description: 'Small dummy text for usps. Small dummy text for usps. N',
    icon: '⚡️',
    dotColor: 'orange',
  },
]
