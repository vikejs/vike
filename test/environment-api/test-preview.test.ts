import { testRunClassic } from '../../test/utils'
import { testEnvironments } from './testEnvironments'
import { test, expect } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

testRunClassic('pnpm run preview')
testEnvironments()

test("the worker environment doesn't contain Vike's server entry", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist/worker/.vite/manifest.json'), 'utf-8'))
  const ids = Object.keys(manifest)
  expect(ids).not.toContain('virtual:@brillout/vite-plugin-server-entry:serverEntry')
  expect(ids).not.toContain('virtual:vike:global-entry:server')
})

test("the worker environment's output file names are Vite's defaults, not Vike's", () => {
  const distWorker = path.join(__dirname, 'dist/worker')
  expect(fs.existsSync(path.join(distWorker, 'entry.js'))).toBe(true)
  expect(fs.existsSync(path.join(distWorker, 'entry.mjs'))).toBe(false)
  // Vike puts server-side chunks in chunks/
  expect(fs.existsSync(path.join(distWorker, 'chunks'))).toBe(false)
})
