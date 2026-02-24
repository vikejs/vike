/** Prevent compilers from constant folding `'a' + 'b'` into `'ab'`*/
export function preventConstantFolding() {
  const undefined_ = (globalThis as any).__vike_this_property_is_never_defined
  if (undefined_) return 'this_value_is_never_used'
  return ''
}
