import { expect, describe, it } from 'vitest'
import { stripPointerImportAttributes } from './pluginStripPointerImportAttribute.js'

// Returns the transformed code, or `null` when nothing was stripped (i.e. the code is left untouched).
async function strip(code: string): Promise<string | null> {
  const result = await stripPointerImportAttributes(code, '/fake-file.js')
  return result ? result.code : null
}

describe('stripPointerImportAttributes()', () => {
  it('strips the import attribute from real imports', async () => {
    expect(await strip("import ssr from './ssr' with { type: 'vike:pointer' }")).toBe("import ssr from './ssr' ")
    expect(await strip("import { a, b as c } from './x' with { type: 'vike:pointer' };")).toBe(
      "import { a, b as c } from './x' ;",
    )
    expect(await strip(`import ssr from "./ssr" with {type:"vike:pointer"}`)).toBe(`import ssr from "./ssr" `)
  })

  it("doesn't touch occurrences inside string/template literals (https://github.com/brillout/docpress/issues/167)", async () => {
    // Documentation code examples get compiled to string literals; the attribute must be preserved.
    expect(await strip(`const code = "import ssr from './ssr' with { type: 'vike:pointer' }"`)).toBe(null)
    expect(await strip("const code = `import x from './x' with { type: 'vike:pointer' }`")).toBe(null)
  })

  it('strips real imports while preserving occurrences inside string literals', async () => {
    expect(
      await strip(
        [
          "import a from './a' with { type: 'vike:pointer' }",
          `const code = "import b from './b' with { type: 'vike:pointer' }"`,
        ].join('\n'),
      ),
    ).toBe(["import a from './a' ", `const code = "import b from './b' with { type: 'vike:pointer' }"`].join('\n'))
  })

  it('leaves code untouched when there is nothing to strip', async () => {
    expect(await strip("import ssr from './ssr'")).toBe(null)
    // The hyphen variant `vike-pointer` (instead of `vike:pointer`) isn't a pointer import attribute.
    expect(await strip("import x from './x' with { type: 'vike-pointer' }")).toBe(null)
  })

  it('preserves the attribute in raw Markdown/MDX documentation (https://github.com/brillout/docpress/issues/167)', async () => {
    // A Markdown code example, as seen when the plugin runs on the raw `.mdx` file (before MDX compilation).
    const mdx = [
      '## Some section',
      '',
      'Tiny page.',
      '',
      '```js',
      "import ssr from './ssr' with { type: 'vike:pointer' }",
      'console.log(ssr)',
      '```',
      '',
    ].join('\n')
    expect(await strip(mdx)).toBe(null)
    // Code that can't be parsed as an ES module is left untouched (no global fallback strip).
    expect(await strip("text { unbalanced 'vike:pointer' with { type: 'vike:pointer' }")).toBe(null)
  })
})
