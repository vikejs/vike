import { hash } from '@node-rs/argon2'
import express from 'express'
import { two } from './shared-chunk.js'

const argon2Opts = {
  memory: 3145728,
  iterations: 2,
  parallelism: 64,
  salt_length: 16,
  key_length: 32
}

;(async () => {
  const hashed = await hash('password', argon2Opts)
  if (typeof hashed !== 'string') {
    throw new Error()
  }
})()

express()

if (two() !== 2) {
  throw new Error()
}
