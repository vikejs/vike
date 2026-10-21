export { guard }

function guard() {
  throw new Error("guard() shouldn't run")
}
