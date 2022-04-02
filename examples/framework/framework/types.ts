export type PageContext = {
  Page: React.ComponentType
  pageProps: Record<string, unknown>
  urlPathname: string
  exports: {
    favicon: string
    PageLayout?: React.ComponentType
  }
}
export type Children = React.ReactNode | React.ReactNode[]
