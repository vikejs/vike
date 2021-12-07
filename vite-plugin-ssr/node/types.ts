type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Internal types
 */
interface PageExportsInternal {
  documentProps: {
    title: string
    description: string
  }
}

export type PageContextBuiltIn = {
  Page: any
  pageExports: Record<string, unknown> & DeepPartial<PageExportsInternal>
  routeParams: Record<string, string>
  url: string
  urlPathname: string
  urlParsed: {
    pathname: string
    search: null | Record<string, string>
    hash: null | string
  }
}

// props defined here are always available in `render()` hook and
// if `renderPage()` is successful also always available there.
export interface OnBeforeRenderBuiltIn {
  pageExports: PageExportsInternal
  pageContext?: DeepPartial<PageExportsInternal>
}

/**
 * Namespace that can be partially overriden by user
 */
export declare namespace VitePluginSsr {
  // can be overriden
  export interface PageContextInit {
    url: string
  }

  // can be overriden
  export interface OnBeforeRender {
  }

  type OnBeforeHookReturnInternal =
    Partial<OnBeforeRenderBuiltIn> & Partial<OnBeforeRender>;

  // OnBeforeHook return type extract for readability and reusability
  export type OnBeforeHookReturn =
    OnBeforeHookReturnInternal | Promise<OnBeforeHookReturnInternal>;

  // OnBeforeRender pageContext have some internally computed props that we add
  export type OnBeforeRenderPageContext = PageContextBuiltIn & PageContextInit;

  // OnBeforeHook type
  export interface OnBeforeHook {
    (context: OnBeforeRenderPageContext): OnBeforeHookReturn
  }

  // util to easily create a functional Component
  export interface Page<Props> {
    (props: Props): any
  }
}

/**
 * Dummy TS wrapper to ensure the following:
 *   - hook type is correct
 *   - hook return type can be infered
 *
 * _key is used as type only, but since this helper as multiple generics, it's impossible to set one and let TS
 * infer the others. Passing key as a value and infering its type is a workaround for this issue.
 */
export function withTypescript<K extends keyof WithTSMapping, H extends WithTSMapping[K]>(_key: K, hook: H) {
  return hook;
}

export interface WithTSMapping {
  onBeforeRender: VitePluginSsr.OnBeforeHook
  render: (context: VitePluginSsr.OnBeforeRenderPageContext &
    OnBeforeRenderBuiltIn & Partial<VitePluginSsr.OnBeforeRender>) => any
}

/**
 * Util types to extract PageProps or PageComponent types (could be moved into namespace)
 */
type GetPagePropsInternal<T> = T extends {
  pageContext?: {
    pageProps?: infer U
  }
} ? U : never;
type AwaitableReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer U> ? U : T;
export type GetPageProps<T extends VitePluginSsr.OnBeforeHook> = GetPagePropsInternal<AwaitableReturnType<T>>;
export type GetPage<T extends VitePluginSsr.OnBeforeHook> = VitePluginSsr.Page<GetPageProps<T>>;
