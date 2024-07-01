export function isVikeReactApp(): boolean {
  const g = globalThis as Record<string, unknown>
  // Set by vike-react https://github.com/vikejs/vike-react/blob/23e92434424f10e7e742b6bf587edee5aa8832df/packages/vike-react/src/renderer/onRenderHtml.tsx#L75
  return !!g._isVikeReactApp
}
