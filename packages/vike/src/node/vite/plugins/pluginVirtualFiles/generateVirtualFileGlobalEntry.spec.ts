import { describe, expect, it } from 'vitest'
import { getCode } from './generateVirtualFileGlobalEntry.js'
import { VIRTUAL_FILE_ID_constantsGlobalThis } from '../pluginReplaceConstantsGlobalThis.js'
import type { PageConfigGlobalBuildTime } from '../../../../types/PageConfig.js'

const pageConfigGlobal = { configValueSources: {}, configDefinitions: {} } as unknown as PageConfigGlobalBuildTime

describe('getCode()', () => {
  it("doesn't import server-only code in a client-side named environment", () => {
    const code = getCode([], pageConfigGlobal, { environmentName: 'widget', isDev: false }, true, 'id')
    expect(code).not.toContain(VIRTUAL_FILE_ID_constantsGlobalThis)
  })
  it('imports it in a server-side named environment', () => {
    const code = getCode([], pageConfigGlobal, { environmentName: 'worker', isDev: false }, false, 'id')
    expect(code).toContain(VIRTUAL_FILE_ID_constantsGlobalThis)
  })
})
