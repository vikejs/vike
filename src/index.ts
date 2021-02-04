import {
  InputOptions,
  PluginContext,
  EmittedAsset,
  NormalizedOutputOptions,
  OutputBundle,
  PluginHooks
} from 'rollup'
import { assert } from './utils/assert'
import { higherFirst } from './utils/sorter'

export { PageConfig, addWindowType } from './types'
// export { renderToHtml };
export { getPage }
export { ssrPlugin }

import { getPageDefinitions, Page } from './getPageDefinitions'

async function getPage(url: string): Promise<Page | null> {
  const pages = await getPageDefinitions()
  const matches = pages
    .filter((page) => !page.isDefaultTemplate)
    .map((page) => {
      const matchValue = page.matchesUrl(url)
      return { page, matchValue }
    })
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )
  if (matches.length === 0) {
    return null
  }
  return matches[0].page
}

type VitePlugin = Partial<PluginHooks> & { name: string }

function ssrPlugin() {
  const plugin: VitePlugin = {
    name: 'vite-plugin-ssr',
    options,
    generateBundle
  }
  return plugin
}

function options(inputOptions: InputOptions) {
  // inputOptions.input = "<div>abc</div>";
  // throw new Error("ewuqh");
  return null
}

async function generateBundle(
  this: PluginContext,
  output: NormalizedOutputOptions,
  bundle: OutputBundle
) {
  const source = '<html>178</html>'

  const htmlFile: EmittedAsset = {
    type: 'asset',
    source,
    name: 'Rollup HTML Asset',
    fileName: 'index.html'
  }

  this.emitFile(htmlFile)
}
