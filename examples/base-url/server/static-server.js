import express from 'express'
import { createExpressApp } from './createExpressApp.js'
import { root } from './root.js'

const { app, startApp } = createExpressApp()
app.use(express.static(`${root}/dist/client`))
startApp()
