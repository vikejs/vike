import express from 'express'
import { createExpressApp } from './createExpressApp.js'
import { base } from './base.js'
import { root } from './root.js'

const { app, startApp } = createExpressApp({ base })
app.use(express.static(`${root}/dist/client`))
startApp()
