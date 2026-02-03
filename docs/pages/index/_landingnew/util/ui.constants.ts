import { FlexGraphicHook } from './constants'

export interface ExtendedShadowColorVariants extends Record<FlexGraphicHook, string> {
  inactive: string
  active: string
}

export const flexGraphicHookShadowVariants = {
  onBeforeRenderClient: 'inset-shadow-onBeforeRenderClient/50',
  Wrapper: 'inset-shadow-Wrapper/50',
  onCreatePageContext: 'inset-shadow-onCreatePageContext/50',
  Head: 'inset-shadow-Head/50',
  onHookCall: 'inset-shadow-onHookCall/50',
  onBeforeRenderHtml: 'inset-shadow-onBeforeRenderHtml/50',
  onRenderClient: 'inset-shadow-onRenderClient/50',
  onCreateGlobalContext: 'inset-shadow-onCreateGlobalContext/50',
  onError: 'inset-shadow-onError/50',
  onRenderHtml: 'inset-shadow-onRenderHtml/50',
  onAfterRenderHtml: 'inset-shadow-onAfterRenderHtml/50',
  inactive: 'inset-shadow-base-100',
  active: 'inset-shadow-base-200',
}
