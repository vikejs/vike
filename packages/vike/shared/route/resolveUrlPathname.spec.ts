import { expect, describe, it } from 'vitest'
import { resolveUrlPathname } from './resolveUrlPathname'

describe('resolveUrlPathname', () => {
  it('basics', () => {
    expect(resolveUrlPathname('/', {})).toEqual('/')
    expect(resolveUrlPathname('/a', {})).toEqual('/a')
    expect(resolveUrlPathname('/@a', { a: '1' })).toEqual('/1')
  })

  it('edge cases', () => {
    expect(resolveUrlPathname('/@a', { a: 'a' })).toEqual('/a')
    expect(resolveUrlPathname('/@a/@b', { a: '@b', b: '1' })).toEqual('/@b/1')
    expect(resolveUrlPathname('/@a/*', { a: '*', '*': '1' })).toEqual('/*/1')
    expect(resolveUrlPathname('/*', { '*': '*' })).toEqual('/*')
  })

  // Not implemented yet
  // it('multiple globs', () => {
  //   expect(resolveUrlPathname('/*/*', { '*1': '*2', '*2': '*' })).toEqual('/*2/*')
  // })
})
