import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { catchInfiniteLoop } from './catchInfiniteLoop.js'

const callTimes = (functionName: `${string}()`, times: number) => {
  for (let i = 0; i < times; i++) catchInfiniteLoop(functionName)
}

describe('catchInfiniteLoop()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('warns once above 49 calls and throws above 99 calls within 5 seconds', () => {
    callTimes('a()', 49)
    expect(console.warn).not.toHaveBeenCalled()
    callTimes('a()', 50)
    expect(console.warn).toHaveBeenCalledOnce()
    expect(() => catchInfiniteLoop('a()')).toThrow('a() called 100 times within 5 seconds — infinite loop?')
  })

  it('starts counting again after 5 seconds', () => {
    callTimes('b()', 99)
    vi.advanceTimersByTime(5001)
    callTimes('b()', 99)
    expect(() => catchInfiniteLoop('b()')).toThrow('b() called 100 times')
  })

  it('counts each function name separately', () => {
    callTimes('c1()', 99)
    callTimes('c2()', 99)
    expect(() => catchInfiniteLoop('c1()')).toThrow('c1() called 100 times')
  })

  it('keeps a tracker that started after an outdated one', () => {
    catchInfiniteLoop('d1()')
    vi.advanceTimersByTime(3000)
    callTimes('d2()', 99)
    vi.advanceTimersByTime(3000)
    expect(() => catchInfiniteLoop('d2()')).toThrow('d2() called 100 times')
  })

  it('resets an outdated tracker that is not cleaned yet', () => {
    vi.setSystemTime(100_000)
    catchInfiniteLoop('e1()')
    vi.setSystemTime(101_000)
    callTimes('e2()', 99)
    // Cleans, but e2()'s tracker isn't outdated yet
    vi.setSystemTime(105_500)
    catchInfiniteLoop('e1()')
    vi.setSystemTime(106_500)
    expect(() => catchInfiniteLoop('e2()')).not.toThrow()
  })

  it('resets an outdated tracker if the clock went backwards', () => {
    vi.setSystemTime(200_000)
    catchInfiniteLoop('f1()')
    vi.setSystemTime(0)
    callTimes('f2()', 99)
    vi.setSystemTime(5001)
    expect(() => catchInfiniteLoop('f2()')).not.toThrow()
  })
})
