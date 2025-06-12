import { stabilizeHashes } from './stabilizeHashes'

import { expect, describe, it } from 'vitest'
describe('preload tags', () => {
  it('Default preload strategy', async () => {
    expect(stabilizeHashes('/assets/_default.page.client.81bbaf22.js')).toBe('/assets/_default.page.client.$HASH.js')
    expect(stabilizeHashes('/assets/_default.page.client.81bbaf22.css')).toBe('/assets/_default.page.client.$HASH.css')
    expect(stabilizeHashes('/assets/chunks/chunk-87271e60.js')).toBe('/assets/chunks/chunk-$HASH.js')
    expect(stabilizeHashes('/assets/entries/pages_index.uEHwyP1_.js')).toBe('/assets/entries/pages_index.$HASH.js')
    expect(stabilizeHashes('/assets/entries/pages_index.uEHwyP1-.js')).toBe('/assets/entries/pages_index.$HASH.js')
  })
})
