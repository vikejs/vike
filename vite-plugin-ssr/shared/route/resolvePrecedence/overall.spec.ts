import { resolvePrecendence } from '../resolvePrecedence'
import { expect, describe, it } from 'vitest'

const routeFilesystem = {
  routeType: 'FILESYSTEM' as const,
  routeString: '/product/lolipop',
}
const routeStringStatic = {
  routeType: 'STRING' as const,
  routeString: '/product/lolipop',
}
const routeStringParam = {
  routeType: 'STRING' as const,
  routeString: '/product/@name',
}
const routeFunction = {
  routeType: 'FUNCTION' as const,
}
const routeFunctionLowestPrio = {
  routeType: 'FUNCTION' as const,
  precedence: -10,
}
const routeFunctionLowPrio = {
  routeType: 'FUNCTION' as const,
  precedence: -1,
}
const routeFunctionHighPrio = {
  routeType: 'FUNCTION' as const,
  precedence: 1,
}
const routeFunctionHighestPrio = {
  routeType: 'FUNCTION' as const,
  precedence: 10,
}

const routeStrings = [routeStringStatic, routeStringParam]

const routeFunctionsLowerPrio = [routeFunction, routeFunctionLowestPrio, routeFunctionLowPrio]
const routeFunctions = [...routeFunctionsLowerPrio, routeFunctionHighPrio, routeFunctionHighestPrio]

describe('routing - resolvePrecendence', () => {
  it('basics', () => {
    expect(resolvePrecendence([routeFilesystem])).toBe(routeFilesystem)
    expect(resolvePrecendence([...routeFunctionsLowerPrio, ...routeStrings, routeFilesystem])).toBe(routeFilesystem)
    expect(resolvePrecendence([...routeFunctionsLowerPrio, ...routeStrings])).toBe(routeStringStatic)
    expect(resolvePrecendence([...routeFunctionsLowerPrio, ...routeStrings])).toBe(routeStringStatic)
    //expect(resolvePrecendence([...routeFunctions, ...routeStrings, routeFilesystem])).toBe(routeFunctionHighestPrio)
    expect(resolvePrecendence([...routeFunctions, ...routeStrings, routeFilesystem])).toBe(routeFunctionHighPrio)
  })
})
