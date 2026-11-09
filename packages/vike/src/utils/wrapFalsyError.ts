export { wrapFalsyError }

function wrapFalsyError(err: unknown) {
  if (err) return err
  return new Error(`The thrown value is \`${String(err)}\``)
}
