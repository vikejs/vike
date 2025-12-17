// Aka XOR
export function isExactlyOneTruthy(...values: unknown[]): boolean {
  return values.filter(Boolean).length === 1
}
