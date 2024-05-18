export function normalizeHeaders(
  /* This type is precise, too precise which can be annoying: e.g. cannot pass a string[][] argument because it doesn't match the more precise [string,string][] type.
  headersOriginal ConstructorParameters<typeof Headers>[0]
  */
  headersOriginal: unknown
): Record<string, string> {
  const headersStandard = new Headers(headersOriginal as any)
  const headers = Object.fromEntries(headersStandard.entries())
  return headers
}
