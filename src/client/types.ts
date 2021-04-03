export { PageInfo }
export { PageInfoPromise }
export { PageInfoRetriever }

type PageInfo = {
  pageId: string
  pageProps: Record<string, unknown>
}
type PageInfoPromise = {
  pageIdPromise: Promise<string>
  pagePropsPromise: Promise<Record<string, unknown>>
}
type PageInfoRetriever = () => PageInfoPromise

