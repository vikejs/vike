import express from 'express'
import vike from 'vike-node/express'

startServer()

function startServer() {
  const app = express()
  app.use(vike())
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}
