import { FlexGraphicHook } from './constants'

export interface ExtendedShadowColorVariants extends Record<FlexGraphicHook, string> {
  inactive: string
  active: string
}

export const flexGraphicHookShadowVariants = {
  onBeforeRenderClient: 'shadow-onBeforeRenderClient/50',
  Wrapper: 'shadow-Wrapper/50',
  onCreatePageContext: 'shadow-onCreatePageContext/50',
  Head: 'shadow-Head/50',
  onHookCall: 'shadow-onHookCall/50',
  onBeforeRenderHtml: 'shadow-onBeforeRenderHtml/50',
  onRenderClient: 'shadow-onRenderClient/50',
  onCreateGlobalContext: 'shadow-onCreateGlobalContext/50',
  onError: 'shadow-onError/50',
  onRenderHtml: 'shadow-onRenderHtml/50',
  onAfterRenderHtml: 'shadow-onAfterRenderHtml/50',
  inactive: 'shadow-base-100',
  active: 'shadow-neutral/20',
}
