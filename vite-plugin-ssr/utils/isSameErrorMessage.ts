export { isSameErrorMessage }

function isSameErrorMessage(err1: unknown, err2: unknown) {
  return (err1 as any)?.message === (err2 as any)?.message
}
