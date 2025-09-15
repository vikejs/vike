export { Page }

function Page() {
  // This will throw an error during rendering to test the onError hook
  throw new Error('Test error for onError hook')
  
  return <div>This should not be rendered</div>
}
