export { wrapFalsyError }

// Vike's error handling expects a truthy value, while a hook or a UI component can `throw null`
function wrapFalsyError(err: unknown) {
  if (err) return err
  return new Error(`The thrown value is \`${String(err)}\``)
}
