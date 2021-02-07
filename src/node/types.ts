export type PageView = any & { _brand?: 'PageView' }
export type Html = string & { _brand?: 'Html' }
export type PageId = string & { _brand?: 'PageId' }
export type PageServerConfig = {
  render: ({ pageView }: { pageView: PageView }) => Promise<Html>
}
export type Url = string & { _brand?: 'Url' }
export type FilePath = string

export { PageInstance }
export { PageConfig }
export { addWindowType }

type Window = {
  vitePluginSsr: {
    page: PageBrowserSide
  }
}

type PageInstance = PageServerSide

type PageConfig = Partial<PageServerProps>

type HtmlProps = Record<string, string>

type PageServerProps = {
  render: (view: any) => string
  html: (
    this: PageServerSide & { viewHtml: string },
    htmlProps: HtmlProps
  ) => Promise<string> | string
}

type PageBrowserSide = {
  view: any
  initialProps: Record<string, unknown>
}
type PageServerSide = PageBrowserSide & PageServerProps

function addWindowType(_: unknown): asserts _ is Window {}

//function assertType<T>(_: unknown): asserts _ is T {}
