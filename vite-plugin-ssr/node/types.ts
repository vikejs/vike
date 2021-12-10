export interface OnInitPageContext {
  url: string
}

export interface BuiltInPageContext extends OnInitPageContext {
  Page: any
  pageExports: Record<string, unknown>
  routeParams: Record<string, string>
  urlPathname: string
  urlParsed: {
    pathname: string
    search: null | Record<string, string>
    hash: null | string
  }
}

// util to easily create a functional Component
interface Page<Props> {
  (props: Props): any
}

/**
 * Util types to extract PageProps or PageComponent types (could be moved into namespace)
 */
type GetPagePropsInternal<T> = T extends {
  pageContext?: {
    pageProps?: infer U
  }
} ? U : never;
type AwaitableReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;
export type GetPageProps<T extends (...args: any) => any> = GetPagePropsInternal<AwaitableReturnType<T>>;
export type GetPage<T extends (...args: any) => any> = Page<GetPageProps<T>>;

export type GetPageContext<T extends {} = {}> = BuiltInPageContext & T;
