import express from 'express'
const { Router } = express

export { createExpressApp }

// Express.js Server with Base URL
//  - https://stackoverflow.com/questions/4375554/is-it-possible-to-set-a-base-url-for-nodejs-app/5994334#5994334
function createExpressApp({ base }) {
  const app = express()
  const router = Router()
  app.use(base, router)
  const startApp = () => {
    const port = 3000
    app.listen(port)
    console.log(`Server running at http://localhost:${port}${base}`)
  }
  return { app: router, startApp }
}
