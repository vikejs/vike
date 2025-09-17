export { Page }

function Page() {
  return (
    <div>
      <h1>Error Test Page</h1>
      <p>This page should trigger an error in the +data.js hook, which should be caught by the global +onError hook.</p>
    </div>
  )
}
