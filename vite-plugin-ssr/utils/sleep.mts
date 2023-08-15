export function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
