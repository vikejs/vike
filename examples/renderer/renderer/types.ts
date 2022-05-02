export type PageContext = {
  Page: React.FC
  pageProps: Record<string, unknown>
  urlPathname: string
  exports: {
    favicon: string
    PageLayout?: React.FC
  }
}
export type Children = React.ReactNode | React.ReactNode[]
