import express from 'express'
import { root } from './root.js'
import { createExpressApp } from './createExpressApp.js'
import cors from 'cors'
import { baseAssets } from '../base.js'
import assert from 'node:assert'

assert(baseAssets === 'http://localhost:8080/cdn/')
const { app, startApp } = createExpressApp({ base: '/cdn/', port: 8080 })

app.use(cors()) // Enable cross-origin requests from our SSR server `http://localhost:3000`
app.use(express.static(`${root}/dist/client`))

startApp()
console.log(`CDN running at ${baseAssets}`)
