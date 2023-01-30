export { executeOnRenderResult }
export type { OnRenderResult }

type StatusCode = null | 200 | 404
type OnRenderResult = (isError: boolean, statusCode: StatusCode) => void | undefined

function executeOnRenderResult(pageContextInit: Record<string, unknown>, isError: boolean, statusCode: StatusCode) {
  const onRenderResult: OnRenderResult | undefined = pageContextInit._onRenderResult as any
  onRenderResult?.(isError, statusCode)
}
