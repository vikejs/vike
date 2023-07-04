export function isProduction(): boolean {
  return typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.NODE_ENV === 'production'
}
