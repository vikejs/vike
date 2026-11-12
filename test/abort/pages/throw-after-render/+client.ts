import { handleError } from 'vike/client/router'

if (location.search === '?two-values') {
  Promise.all([handleError(new Error('First value')), handleError(new Error('Second value'))]).then(() =>
    console.log('handleError() settled'),
  )
}
