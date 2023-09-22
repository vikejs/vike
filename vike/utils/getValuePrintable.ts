export function getValuePrintable(value: unknown): null | string {
  if (([null, undefined] as unknown[]).includes(value)) return String(value)
  if (['undefined', 'boolean', 'number', 'string'].includes(typeof value)) return JSON.stringify(value)
  return null
}
