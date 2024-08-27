import type { IncomingMessage, ServerResponse } from 'http'

export type HeadersProvided = Record<string, string | string[] | undefined> | Headers
export type VikeHttpResponse = Awaited<ReturnType<typeof import('vike/server').renderPage>>['httpResponse']
export type NextFunction = (err?: unknown) => void
export type VikeOptions<PlatformRequest = null> = {
  pageContext?: ((req: PlatformRequest) => Record<string, any> | Promise<Record<string, any>>) | Record<string, any>
  compress?: boolean | 'static'
  static?: boolean | string | { root?: string; cache?: boolean }
  onError?: (err: unknown) => void
}
export type ConnectMiddleware<
  PlatformRequest extends IncomingMessage = IncomingMessage,
  PlatformResponse extends ServerResponse = ServerResponse
> = (req: PlatformRequest, res: PlatformResponse, next: NextFunction) => void
export type WebHandler = (request: Request) => Response | undefined | Promise<Response | undefined>
