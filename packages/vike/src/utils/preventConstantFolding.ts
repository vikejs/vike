/** Prevent compilers from constant folding `'a' + 'b'` into `'ab'`*/
export function preventConstantFolding() {
  const undefined_ = (globalThis as any).__vike__this_property_is_never_defined
  if (undefined_) return '__vike__this_string_is_never_used' as never
  return '' as const
}
