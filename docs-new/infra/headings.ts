import React from 'react'
import { assert } from '../utils'

type HeadingBase = {
  title: string | JSX.Element
  level: number
  url?: string
  titleAddendum?: string
  titleInNav?: string | JSX.Element
  isActive?: true
}
type HeadingAbstract = {
  url?: undefined
  titleAddendum?: undefined
  titleInNav?: undefined
  isActive?: undefined
}
export type Heading = HeadingBase &
  (
    | ({ level: 4 } & HeadingAbstract)
    | ({ level: 1 } & HeadingAbstract)
    | {
        level: 2
        url: string
      }
  )
export const headings: Heading[] = [
  {
    level: 1,
    title: withEmoji('Compass', 'Overview')
  },
  {
    level: 2,
    title: 'Introduction',
    url: '/'
  },
  {
    level: 2,
    title: 'Vue Tour',
    url: '/vue-tour'
  },
  {
    level: 2,
    title: 'React Tour',
    url: '/react-tour'
  },
  {
    level: 1,
    title: withEmoji('Seedling', 'Get Started')
  },
  {
    level: 2,
    title: 'Boilerplates',
    url: '/boilerplates'
  },
  {
    level: 2,
    title: 'Manual Installation',
    url: '/install'
  },
  {
    level: 1,
    title: withEmoji('Books', 'Guides')
  },
  {
    level: 4,
    title: 'Basics'
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching'
  },
  {
    level: 2,
    title: 'Routing',
    url: '/routing'
  },
  {
    level: 2,
    title: 'Pre-rendering (SSG)',
    url: '/pre-rendering'
  },
  {
    level: 4,
    title: 'More'
  },
  {
    level: 2,
    title: 'SPA vs SSR vs HTML',
    url: '/SPA-vs-SSR-vs-HTML'
  },
  {
    level: 2,
    title: 'HTML `head`',
    url: '/html-head'
  },
  {
    level: 2,
    title: 'Page Redirection',
    url: '/page-redirection'
  },
  {
    level: 2,
    title: 'Base URL',
    url: '/base-url'
  },
  {
    level: 2,
    title: 'Import Paths Alias Mapping',
    url: '/paths-mapping'
  },
  {
    level: 2,
    title: parse('`.env` Files'),
    url: '/.env'
  },
  {
    level: 1,
    title: withEmoji('Plug', 'Integration')
  },
  {
    level: 2,
    title: 'Authentication',
    titleAddendum: 'NextAuth.js, Passport.js, Auth0, Grant, ...',
    url: '/auth'
  },
  {
    level: 2,
    title: 'Markdown',
    url: '/markdown'
  },
  {
    level: 2,
    title: 'Store (Vuex, Redux, ...)',
    url: '/store'
  },
  {
    level: 2,
    title: 'GraphQL & RPC',
    titleAddendum: '',
    url: '/graphql-rpc'
  },
  {
    level: 2,
    title: 'Tailwind CSS',
    url: '/tailwind-css'
  },
  {
    level: 2,
    title: 'Other',
    titleAddendum: 'CSS Frameworks, Service Workers, ...',
    url: '/tools'
  },
  {
    level: 1,
    title: withEmoji('Earth', 'Deploy')
  },
  {
    level: 2,
    title: 'Satic Hosts',
    titleAddendum: 'Netlify, GitHub Pages, Cloudflare Pages, ...',
    url: '/static-hosts'
  },
  {
    level: 2,
    title: 'Cloudflare Workers',
    url: '/cloudflare-workers'
  },
  {
    level: 2,
    title: 'AWS Lambda',
    url: '/aws-lambda'
  },
  {
    level: 2,
    title: 'Firebase',
    url: '/firebase'
  },
  {
    level: 2,
    title: 'Other',
    url: '/deploy'
  },
  {
    level: 1,
    title: withEmoji('Gear', 'API')
  },
  {
    level: 4,
    title: 'Node.js & Browser'
  },
  {
    level: 2,
    title: parse('`*.page.js`'),
    url: '/.page.js'
  },
  {
    level: 2,
    title: parse('`pageContext`'),
    url: '/pageContext'
  },
  {
    level: 2,
    title: parse('`*.page.server.js`'),
    url: '/.page.server.js'
  },
  {
    level: 2,
    title: parse('`addPageContext()` hook'),
    titleInNav: parse(getListPrefix() + '`export { addPageContext }`'),
    url: '/addPageContext'
  },
  {
    level: 2,
    title: parse('`passToClient`'),
    titleInNav: parse(getListPrefix()+'`export { passToClient }`'),
    url: '/passToClient'
  },
  {
    level: 2,
    title: parse('`render()` hook'),
    titleInNav: parse(getListPrefix()+'`export { render }`'),
    url: '/render'
  },
  {
    level: 2,
    title: parse('`prerender()` hook'),
    titleInNav: parse(getListPrefix()+'`export { prerender }`'),
    url: '/prerender-hook'
  },
  {
    level: 2,
    title: parse("`import { html } from 'vite-plugin-ssr'`"),
    titleInNav: parse('`html` string template tag'),
    url: '/html-tag'
  },
  {
    level: 4,
    title: 'Browser'
  },
  {
    level: 2,
    title: parse('`*.page.client.js`'),
    url: '/.page.client.js'
  },
  {
    level: 2,
    title: parse("import { getPage } from 'vite-plugin-ssr/client'"),
    titleInNav: parse('`getPage()`'),
    url: '/getPage'
  },
  {
    level: 2,
    title: parse("import { useClientRouter } from 'vite-plugin-ssr/client/router'"),
    titleInNav: parse('`useClientRouter()`'),
    url: '/useClientRouter'
  },
  {
    level: 2,
    title: parse("`import { navigate } from 'vite-plugin-ssr/client/router'`"),
    titleInNav: parse('`navigate()`'),
    url: '/navigate'
  },
  {
    level: 4,
    title: 'Routing'
  },
  {
    level: 2,
    title: parse('`*.page.route.js`'),
    url: '/.page.route.js'
  },
  {
    level: 2,
    title: 'Route String',
    url: '/route-string'
  },
  {
    level: 2,
    title: 'Route Function',
    url: '/route-function'
  },
  {
    level: 2,
    title: 'Filesystem Routing',
    url: '/filesystem-routing'
  },
  {
    level: 4,
    title: 'Special Pages'
  },
  {
    level: 2,
    title: parse('`_default.page.*`'),
    url: '/_default.page'
  },
  {
    level: 2,
    title: parse('`_error.page.*`'),
    url: '/_error.page'
  },
  {
    level: 4,
    title: 'Integration'
  },
  {
    level: 2,
    title: parse("`import { createPageRender } from 'vite-plugin-ssr'` (Server Integration Point)"),
    titleInNav: parse('`createPageRender()` (Server Integration Point)'),
    url: '/createPageRender'
  },
  {
    level: 2,
    title: parse("`import ssr from 'vite-plugin-ssr/plugin'` (Vite Plugin)"),
    titleInNav: 'Vite Plugin',
    url: '/vite-plugin'
  },
  {
    level: 4,
    title: 'CLI'
  },
  {
    level: 2,
    title: parse('Command `prerender`'),
    url: '/prerender-command'
  }
]

assert_headings()
function assert_headings() {
  const urls: Record<string, true> = {}
  headings.forEach((heading) => {
    if (heading.url) {
      const { url } = heading
      assert(!urls[url], { url })
      urls[url] = true
    }
  })
}

function getListPrefix() {
  const nonBreakingSpace = String.fromCodePoint(0x00a0)
  const bulletPoint = String.fromCodePoint(0x2022)
  return nonBreakingSpace + bulletPoint + nonBreakingSpace
}

function parse(title: string): JSX.Element {
  type Part = { nodeType: 'text' | 'code'; content: string }
  const parts: Part[] = []
  let current: Part | undefined
  title.split('').forEach((letter) => {
    if (letter === '`') {
      if (current?.nodeType === 'code') {
        // Code block end
        parts.push(current)
        current = undefined
      } else {
        // Code block begin
        if (current) {
          parts.push(current)
        }
        current = { nodeType: 'code', content: '' }
      }
    } else {
      if (!current) {
        current = { nodeType: 'text', content: '' }
      }
      current.content += letter
    }
  })
  if( current ) {
    parts.push(current)
  }

  const titleJsx = React.createElement(
    React.Fragment,
    {},
    parts.map((part) => {
      if (part.nodeType === 'code') {
        return React.createElement('code', {}, part.content)
      } else {
        assert(part.nodeType === 'text')
        return part.content
      }
    })
  )

  return titleJsx
}

type EmojiName = 'Compass' | 'Seedling' | 'Books' | 'Plug' | 'Earth' | 'Gear'

function withEmoji(emojiName: EmojiName, title: string): JSX.Element {
  return React.createElement(React.Fragment, {}, [Emoji(emojiName), ' ', title])
}

function Emoji(name: EmojiName): JSX.Element {
  const codePoint = (
    name === 'Compass' && 0x1F9ED ||
    name === 'Seedling' && 0x1F331 ||
    name === 'Books' && 0x1F4DA ||
    name === 'Plug' && 0x1F50C ||
    name === 'Earth' && 0x1F30D ||
    name === 'Gear' && 0x2699
  )
  assert(codePoint)
  const str = String.fromCodePoint(codePoint)
  const style = {fontSize: '1.4em'}
  return React.createElement('span', {style}, str)
}
