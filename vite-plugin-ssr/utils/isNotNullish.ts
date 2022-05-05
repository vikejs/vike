export const isNotNullish = <T>(p: T | null | undefined): p is T => p !== null && p !== undefined
