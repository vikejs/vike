import { expect, describe, it, vi } from 'vitest'
import { getBetterError } from './getBetterError.js'

describe('getBetterError', () => {
  it('handles standard Error objects', () => {
    const originalError = new Error('Original message')
    const result = getBetterError(originalError, {})

    expect(result.message).toBe('Original message')
    expect(result.stack).toBeDefined()
    expect(result.stack).toContain('Original message')
  })

  it('modifies error message', () => {
    const originalError = new Error('Original message')
    const result = getBetterError(originalError, {
      message: 'Modified message',
    })

    expect(result.message).toBe('Modified message')
    expect(result.stack).toContain('Modified message')
    expect(result.stack).not.toContain('Original message')
  })

  it('modifies error stack', () => {
    const originalError = new Error('Test error')
    const result = getBetterError(originalError, {
      stack: 'Custom stack trace',
    })

    expect(result.stack).toBe('Custom stack trace')
  })

  it('hides stack when hideStack is true', () => {
    const originalError = new Error('Test error')
    const result = getBetterError(originalError, {
      hideStack: true,
    })

    expect(result.hideStack).toBe(true)
  })

  it('preserves getOriginalError chain', () => {
    const firstError = new Error('First error')
    const secondError = getBetterError(firstError, { message: 'Second error' })
    const thirdError = getBetterError(secondError, { message: 'Third error' })

    expect(thirdError.getOriginalError()).toBe(firstError)
    expect(secondError.getOriginalError()).toBe(firstError)
  })

  it('handles non-object errors', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = getBetterError('string error', {})

    expect(result.message).toBe('string error')
    expect(result.stack).toBeDefined()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Malformed error: ', 'string error')

    consoleWarnSpy.mockRestore()
  })

  it('handles null as error', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = getBetterError(null, {})

    expect(result.message).toBe('null')
    expect(result.stack).toBeDefined()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Malformed error: ', null)

    consoleWarnSpy.mockRestore()
  })

  it('handles undefined as error', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = getBetterError(undefined, {})

    expect(result.message).toBe('undefined')
    expect(result.stack).toBeDefined()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Malformed error: ', undefined)

    consoleWarnSpy.mockRestore()
  })

  it('handles number as error', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = getBetterError(42, {})

    expect(result.message).toBe('42')
    expect(result.stack).toBeDefined()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Malformed error: ', 42)

    consoleWarnSpy.mockRestore()
  })

  it('handles error objects without stack', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const errorWithoutStack = { message: 'Error without stack' }
    const result = getBetterError(errorWithoutStack, {})

    expect(result.message).toBe('Error without stack')
    expect(result.stack).toBeDefined()
    expect(consoleWarnSpy).toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
  })

  it('handles error objects with malformed stack', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const errorWithMalformedStack = {
      message: 'Error message',
      stack: 'Stack without message',
    }
    const result = getBetterError(errorWithMalformedStack, {})

    expect(result.message).toBe('Error message')
    expect(result.stack).toBe('Stack without message')
    expect(consoleWarnSpy).toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
  })

  it('handles empty message', () => {
    const errorWithEmptyMessage = new Error()
    const result = getBetterError(errorWithEmptyMessage, {})

    expect(result.message).toBe('')
    expect(result.stack).toBeDefined()
  })

  it('combines message and stack modifications', () => {
    const originalError = new Error('Original')
    const result = getBetterError(originalError, {
      message: 'Modified',
      stack: 'Custom stack',
    })

    expect(result.message).toBe('Modified')
    expect(result.stack).toBe('Custom stack')
  })

  it('replaces all occurrences of message in stack', () => {
    const error = new Error('duplicate')
    // Manually create a stack with duplicate occurrences
    error.stack = 'Error: duplicate\n  at duplicate'

    const result = getBetterError(error, {
      message: 'replaced',
    })

    expect(result.message).toBe('replaced')
    expect(result.stack).toBe('Error: replaced\n  at replaced')
  })

  it('structuredClone limits error properties to message and stack', () => {
    const customError = new Error('Custom error')
    customError.code = 'E_CUSTOM'
    customError.statusCode = 500

    const result = getBetterError(customError, {})

    // structuredClone only preserves message and stack from Error objects
    expect(result.message).toBe('Custom error')
    expect(result.stack).toBeDefined()
    expect(result.code).toBeUndefined()
    expect(result.statusCode).toBeUndefined()
  })

  it('getOriginalError returns the error when no chain exists', () => {
    const error = new Error('Test')
    const result = getBetterError(error, {})

    expect(result.getOriginalError()).toBe(error)
  })
})
