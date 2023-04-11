// Express.js Server with Base URL
//  - https://stackoverflow.com/questions/4375554/is-it-possible-to-set-a-base-url-for-nodejs-app/5994334#5994334
export { createExpressApp }

import express from 'express'
const { Router } = express

function createExpressApp({ base, port }) {
  const appContainer = express()
  const app = Router()
  appContainer.use(base, app)
  const startApp = () => {
    appContainer.listen(port)
  }
  return { app, startApp }
}
