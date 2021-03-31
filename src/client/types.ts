
export type PageInfo = {
  pageId: string
  pageProps: Record<string, unknown>
}
export type PageInfoPromise = {
  pageIdPromise: Promise<string>
  pagePropsPromise: Promise<Record<string, unknown>>
}
export type PageInfoRetriever = () => PageInfoPromise