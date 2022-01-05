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




// --- TESTING

// Defined by lib for default props + can be overriden by user
export interface OnBeforeRenderPageContext {
  something?: number
  documentProps?: {
    title?: string,
  }
}

// Used to validate and return values from onBeforeRender
// Allow props other than `pageContext` here ?
function wrapResponse<P>(ctx: OnBeforeRenderPageContext & { pageProps: P }) {
  return {
    pageContext: {
      ...ctx
    },
  }
}

const onBeforeRender = () => {

  return wrapResponse({
    pageProps: {
      movies: ['']
    },
    // The page's <title>
    documentProps: { title: '' },
    something: 42,
    // TS DOES complain !!
    shouldNotExist: 1,
  });
}

// PageProps here is good too !!
type PageProps = GetPageProps<typeof onBeforeRender>