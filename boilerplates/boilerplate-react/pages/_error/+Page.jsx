import PropTypes from 'prop-types'

export { Page }

Page.propTypes = {
  is404: PropTypes.bool
}
function Page({ is404 }) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    )
  } else {
    return (
      <>
        <h1>500 Internal Error</h1>
        <p>Something went wrong.</p>
      </>
    )
  }
}
