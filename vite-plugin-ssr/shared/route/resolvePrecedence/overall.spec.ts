import { resolvePrecendence } from '../resolvePrecedence.js'
import { expect, describe, it } from 'vitest'

const routeFilesystemStatic = {
  routeType: 'FILESYSTEM' as const,
  routeString: '/product/lolipop'
}
const routeFilesystemParam = {
  routeType: 'FILESYSTEM' as const,
  routeString: '/product/@name'
}
const routeStringStatic = {
  routeType: 'STRING' as const,
  routeString: '/product/lolipop'
}
const routeStringParam = {
  routeType: 'STRING' as const,
  routeString: '/product/@name'
}
const routeFunction = {
  routeType: 'FUNCTION' as const
}
const routeFunctionLowestPrio = {
  routeType: 'FUNCTION' as const,
  precedence: -10
}
const routeFunctionLowPrio = {
  routeType: 'FUNCTION' as const,
  precedence: -1
}
const routeFunctionHighPrio = {
  routeType: 'FUNCTION' as const,
  precedence: 1
}
const routeFunctionHighestPrio = {
  routeType: 'FUNCTION' as const,
  precedence: 10
}

const routeStrings = [routeStringStatic, routeStringParam]

const routeFunctionsLowerPrio = [routeFunction, routeFunctionLowestPrio, routeFunctionLowPrio]
const routeFunctions = [...routeFunctionsLowerPrio, routeFunctionHighPrio, routeFunctionHighestPrio]

describe('routing - resolvePrecendence', () => {
  it('basics', () => {
    expect(resolve([routeFilesystemStatic])).toBe(routeFilesystemStatic)

    expect(resolve([routeFilesystemParam, routeFilesystemStatic])).toBe(routeFilesystemStatic)
    expect(resolve([routeFilesystemStatic, routeFilesystemParam])).toBe(routeFilesystemStatic)

    expect(resolve([routeStringParam, routeStringStatic])).toBe(routeStringStatic)
    expect(resolve([routeFunction, routeStringStatic])).toBe(routeStringStatic)
    expect(resolve([routeFunction, routeStringParam])).toBe(routeFunction)

    expect(resolve([...routeFunctionsLowerPrio, ...routeStrings])).toBe(routeStringStatic)
    expect(resolve([...routeFunctionsLowerPrio, routeStringParam])).toBe(routeFunction)
    expect(resolve([routeFunctionLowPrio, routeStringParam])).toBe(routeStringParam)

    expect(resolve([routeFunction, routeFilesystemStatic])).toBe(routeFilesystemStatic)
    expect(resolve([routeFunctionHighPrio, routeFilesystemStatic])).toBe(routeFunctionHighPrio)
    expect(resolve([...routeFunctionsLowerPrio, ...routeStrings, routeFilesystemStatic])).toBe(routeFilesystemStatic)

    expect(resolve([routeFunctionHighPrio, routeFunctionLowPrio])).toBe(routeFunctionHighPrio)
    expect(resolve([...routeFunctions, ...routeStrings, routeFilesystemStatic])).toBe(routeFunctionHighestPrio)
  })
})

function resolve(routeMatches: Parameters<typeof resolvePrecendence>[0]) {
  resolvePrecendence(routeMatches)
  return routeMatches[0]
}
