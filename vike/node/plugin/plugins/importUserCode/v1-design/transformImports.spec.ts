import { expect, describe, it } from 'vitest'
import { transformImports } from './transformImports.js'

function t(code: string) {
  return transformImports(code, '/fake-file.js', true)
}

describe('transformImports()', () => {
  it('basics', () => {
    expect(t('bla')).toMatchInlineSnapshot(`
      {
        "noTransformation": true,
      }
    `)
    expect(t("import { something } from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const something = '​import:./bla.js:something';",
        "fileImportsTransformed": [
          {
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla.js'",
            "importString": "​import:./bla.js:something",
          },
        ],
        "noTransformation": false,
      }
    `)
    expect(t("import def from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const def = '​import:./bla.js:default';",
        "fileImportsTransformed": [
          {
            "importLocalName": "def",
            "importStatementCode": "import def from './bla.js'",
            "importString": "​import:./bla.js:default",
          },
        ],
        "noTransformation": false,
      }
    `)
  })
  it('removes unused imports', () => {
    expect(t("import './style.css'")).toMatchInlineSnapshot(`
      {
        "code": "",
        "fileImportsTransformed": [],
        "noTransformation": false,
      }
    `)
    expect(t("import './script.js'")).toMatchInlineSnapshot(`
      {
        "code": "",
        "fileImportsTransformed": [],
        "noTransformation": false,
      }
    `)
  })
  it('import as', () => {
    expect(t("import { bla as blu } from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const blu = '​import:./bla.js:bla';",
        "fileImportsTransformed": [
          {
            "importLocalName": "blu",
            "importStatementCode": "import { bla as blu } from './bla.js'",
            "importString": "​import:./bla.js:bla",
          },
        ],
        "noTransformation": false,
      }
    `)
    expect(t("import * as blo from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const blo = '​import:./bla.js:*';",
        "fileImportsTransformed": [
          {
            "importLocalName": "blo",
            "importStatementCode": "import * as blo from './bla.js'",
            "importString": "​import:./bla.js:*",
          },
        ],
        "noTransformation": false,
      }
    `)
  })
  it('real imports', () => {
    expect(t("import { something } from './bla.js?real'")).toMatchInlineSnapshot(`
      {
        "code": "import { something } from ./bla.js",
        "fileImportsTransformed": [],
        "noTransformation": false,
      }
    `)
  })
})
