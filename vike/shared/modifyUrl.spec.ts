import { modifyUrl } from './modifyUrl.js'
import { expect, describe, it } from 'vitest'

describe('modifyUrl', () => {
  it('basics', () => {
    expect(modifyUrl('/products', { pathname: '/cars' })).toMatchInlineSnapshot(`"/cars"`)
    expect(modifyUrl('/products', { search: { filter: 'cars' } })).toMatchInlineSnapshot(`"/products?filter=cars"`)
    expect(modifyUrl('/products?filter=cars', { search: { sort: 'asc' } })).toMatchInlineSnapshot(
      `"/products?filter=cars&sort=asc"`
    )
    expect(
      modifyUrl('/products?country=germany', { search: { filter: 'car', country: null, sort: 'asc' } })
    ).toMatchInlineSnapshot(`"/products?filter=car&sort=asc"`)
    expect(
      modifyUrl('/products?country=germany#reviews', { search: { sort: 'asc', filter: 'car' } })
    ).toMatchInlineSnapshot(`"/products?country=germany&sort=asc&filter=car#reviews"`)
    expect(modifyUrl('/products?country=germany#reviews', { hash: 'spec' })).toMatchInlineSnapshot(
      `"/products?country=germany#spec"`
    )
    expect(modifyUrl('/products?country=germany#reviews', { hash: null })).toMatchInlineSnapshot(
      `"/products?country=germany"`
    )
    expect(modifyUrl('/products?country=germany#reviews', { pathname: '/cars' })).toMatchInlineSnapshot(
      `"/cars?country=germany#reviews"`
    )
    expect(
      modifyUrl('/products?country=germany#reviews', { search: new URLSearchParams({ filter: 'car' }) })
    ).toMatchInlineSnapshot(`"/products?filter=car#reviews"`)
  })
  it('erase', () => {
    expect(
      modifyUrl('/products?country=germany', { search: { sort: 'asc', filter: 'car', country: null } })
    ).toMatchInlineSnapshot(`"/products?sort=asc&filter=car"`)
  })
  it('error handling', () => {
    expect(() => modifyUrl('/products', { pathname: 'cars' })).toThrowError("it should start with '/'")
  })
  it('edge cases', () => {
    expect(modifyUrl('/products?country=germany#reviews', { hash: '' })).toMatchInlineSnapshot(
      `"/products?country=germany#"`
    )
    expect(modifyUrl('/products?country=germany#reviews', { hash: null })).toMatchInlineSnapshot(
      `"/products?country=germany"`
    )
    expect(modifyUrl('/products?filter=cars', { search: { filter: null } })).toMatchInlineSnapshot(`"/products"`)
  })
  it('edge cases - unsupported types', () => {
    expect(modifyUrl('/products?country=germany', { search: { country: undefined as any } })).toMatchInlineSnapshot(
      `"/products"`
    )
    expect(modifyUrl('/products', { search: { zip: 75016 as any } })).toMatchInlineSnapshot(`"/products?zip=75016"`)
  })
})
