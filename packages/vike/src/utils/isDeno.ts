export function isDeno(): boolean {
  return typeof Deno !== 'undefined' && typeof Deno.version === 'object' && typeof Deno.version.deno === 'string'
}
declare const Deno:
  | {
      version?: { deno?: string }
    }
  | undefined
