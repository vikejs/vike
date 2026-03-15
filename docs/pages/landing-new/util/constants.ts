import { UiColorVariantKey } from './ui.constants'

import vuetifyImg from '../assets/tech-icons/vuetify.svg'
import piniaImg from '../assets/tech-icons/pinia.svg'
import tanstackImg from '../assets/tech-icons/tanstack.svg'
import vueImg from '../assets/tech-icons/vue.svg'
import reactImg from '../assets/tech-icons/react.svg'
import apolloImg from '../assets/tech-icons/apollo.svg'
import reduxImg from '../assets/tech-icons/redux.svg'
import vercelImg from '../assets/tech-icons/vercel.svg'
import sentryImg from '../assets/tech-icons/sentry.svg'
import solidImg from '../assets/tech-icons/solid.svg'
import { BrickWallShield, LucideIcon, ShoppingCart } from 'lucide-react'

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

export const UspCategoryId = {
  freedom: 'freedom',
  stability: 'stability',
  lightningDx: 'lightning-dx',
} as const
export type UspId = (typeof UspCategoryId)[keyof typeof UspCategoryId]

type Usp = {
  id: UspId
  title: string
  description: string
  icon: string
  dotColor: UiColorVariantKey
}

export const landingPageHeroUsps: Usp[] = [
  {
    id: UspCategoryId.freedom,
    title: 'Freedom',
    description: 'Build whatever you want with unprecedented flexibility.',
    icon: '🕊️',
    dotColor: 'green',
  },
  {
    id: UspCategoryId.stability,
    title: 'Stability',
    description: 'Create apps on a stable foundation you can rely on.',
    icon: '💎',
    dotColor: 'blue',
  },
  {
    id: UspCategoryId.lightningDx,
    title: 'Lightning DX',
    description: 'State-of-the-art and novel developer experiences.',
    icon: '⚡️',
    dotColor: 'orange',
  },
]

const NavigationTabFrameworks = {
  react: 'react',
  vue: 'vue',
  solid: 'solid',
}
type NavigationTabFrameworks = typeof NavigationTabFrameworks
export type NavigationTabFramework = NavigationTabFrameworks[keyof NavigationTabFrameworks]

export type FlexEditorTabTool = {
  name?: string
  imgKey?: string
  brandColor?: string
}

export type FlexEditorTab = {
  title: string
  frontend: NavigationTabFramework
  rendering: string
  backend: string
  api: string
  deployment: string
  tools: FlexEditorTabTool[]
}

export const flexEditorTabs: FlexEditorTab[] = [
  {
    title: 'Marketing pages',
    frontend: NavigationTabFrameworks.solid,
    rendering: 'SSG',
    backend: 'none',
    api: 'none',
    deployment: 'static (e.g. GitHub Pages)',
    tools: [{ name: 'Solidjs', imgKey: solidImg, brandColor: '#6DB33F' }],
  },
  {
    title: 'Admin panel',
    frontend: NavigationTabFrameworks.vue,
    rendering: 'SPA',
    backend: 'external (Java/Laravel/Rails/Django/...)',
    api: 'REST',
    deployment: 'static (e.g. GitHub Pages)',
    tools: [
      { name: 'Vue', imgKey: vueImg, brandColor: '#4FC08D' },
      { name: 'Tanstack query', imgKey: tanstackImg, brandColor: '#FF4154' },
      { name: 'Pinia', imgKey: piniaImg, brandColor: '#EA4E92' },
      { name: 'Vuetify', imgKey: vuetifyImg, brandColor: '#1867C0' },
    ],
  },
  {
    title: 'E-commerce',
    frontend: NavigationTabFrameworks.react,
    rendering: 'SSR',
    backend: 'Node.js',
    api: 'GraphQL',
    deployment: 'Cloudflare',
    tools: [
      { name: 'React', imgKey: reactImg, brandColor: '#61DAFB' },
      { name: 'Apollo', imgKey: apolloImg, brandColor: '#311C87' },
      { name: 'Redux', imgKey: reduxImg, brandColor: '#764ABC' },
      { name: 'Styled-jsx', imgKey: vercelImg, brandColor: '#000000' },
      { name: 'Sentry', imgKey: sentryImg, brandColor: '#E03E2F' },
    ],
  },
]
