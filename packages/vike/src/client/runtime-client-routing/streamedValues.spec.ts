import { it, expect, vi } from 'vitest'
vi.mock('../assertEnvClient.js', () => ({}))
// E.g. a new frontend was deployed (a mock factory can't throw the browser's error as is)
vi.mock('../shared/streamedValues.js', () => ({
  get readPageContextJsonStreamed() {
    throw new TypeError('Failed to fetch dynamically imported module: https://example.com/assets/chunks/chunk-1234.js')
  },
}))
import { readPageContextJson } from './streamedValues.js'
import { isErrorFetchingStaticAssets } from '../shared/loadPageConfigsLazyClientSide.js'

it('the decoder failing to load is an error fetching static assets (Vike falls back to Server Routing)', async () => {
  const err = await readPageContextJson(new Response('{"p":"!VikePromise:0","_streamedValues":[\n]}\n')).catch(
    (err) => err,
  )
  expect(isErrorFetchingStaticAssets(err)).toBe(true)
})
