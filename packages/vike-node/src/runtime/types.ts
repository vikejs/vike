export type HeadersProvided = Record<string, string | string[] | undefined> | Headers
export type VikeHttpResponse = Awaited<ReturnType<typeof import('vike/server').renderPage>>['httpResponse']
export type NextFunction = (err?: Error) => void
export type VikeOptions<PlatformRequest = null> = {
  pageContext?: ((req: PlatformRequest) => Record<string, any> | Promise<Record<string, any>>) | Record<string, any>
  serveAssets?: boolean | { root?: string; compress?: boolean; cache?: boolean }
  onError?: (err: unknown) => void
}
