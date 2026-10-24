export { hasUnsavedChanges }
export { setUnsavedChanges }

let unsavedChanges = false

function hasUnsavedChanges() {
  return unsavedChanges
}
function setUnsavedChanges(value: boolean) {
  unsavedChanges = value
}
