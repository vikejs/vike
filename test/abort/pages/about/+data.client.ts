export default data

function data() {
  if (location.search === '?data-client-null') throw null
}
