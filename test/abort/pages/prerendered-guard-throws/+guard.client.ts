export default guard

function guard() {
  throw new Error('PRERENDERED_GUARD_THROWS')
}
