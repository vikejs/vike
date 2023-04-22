import { stabilizeHashs } from './stabilizeHashs'

import { expect, describe, it } from 'vitest'
describe('preload tags', () => {
  it('Default preload strategy', async () => {
    expect(stabilizeHashs('/assets/_default.page.client.81bbaf22.js')).toBe('/assets/_default.page.client.$HASH.js')
    expect(stabilizeHashs('/assets/_default.page.client.81bbaf22.css')).toBe('/assets/_default.page.client.$HASH.css')
    expect(stabilizeHashs('/assets/chunks/87271e60.js')).toBe('/assets/chunks/$HASH.js')
  })
})
