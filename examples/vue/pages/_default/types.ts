export type Component = any
export type ContextProps = {
  pageProps: Record<string, unknown>
  docTitle?: string
  routeParams: Record<string, unknown>
} & Record<string, any>
