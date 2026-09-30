export function data() {
  return { cancelCount: globalThis.__cancelCount ?? 0 }
}
