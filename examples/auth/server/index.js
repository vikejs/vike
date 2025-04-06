import cookieParser from 'cookie-parser'
import express from 'express'
import { createDevMiddleware, renderPage } from 'vike/server'
import { root } from './root.js'
import { checkCredentials, getUser } from './users.js'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

startServer()

async function startServer() {
  const app = express()
  auth(app)
  await assets(app)
  vike(app)
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function auth(app) {
  app.use(cookieParser())
  app.use(function (req, _res, next) {
    const { username } = req.cookies
    const user = !username ? null : getUser(username)
    req.user = user
    next()
  })
  app.use(express.json()) // Parse & make HTTP request body available at `req.body`
  app.post('/_auth/login', (req, res) => {
    const { username, password } = req.body
    const user = checkCredentials(username, password)
    if (user) {
      res.cookie('username', username, {
        maxAge: 24 * 60 * 60 * 1000, // One day
        httpOnly: true // Only the server can read the cookie
      })
    }
    const success = !!user
    res.end(JSON.stringify({ success }))
  })
  app.post('/_auth/logout', (_req, res) => {
    res.clearCookie('username')
    res.end()
  })
}

async function assets(app) {
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }
}

function vike(app) {
  app.get('/{*vikeCatchAll}', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      user: req.user,
      userFullName: req.user?.fullName
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    httpResponse.pipe(res)
  })
}
