export { data }

async function data() {
  // This will throw an error during data fetching to test the onError hook
  throw new Error('Test data error for onError hook')
}
