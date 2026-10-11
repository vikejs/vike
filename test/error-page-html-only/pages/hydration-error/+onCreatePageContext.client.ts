// An error that occurs upon every hydration of this page
export function onCreatePageContext() {
  throw new Error('Some persistent client-side error')
}
