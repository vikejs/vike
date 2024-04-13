// Typesafe Array.isArray() — asserting unknown[] instead of any[]
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
