export { headings }
export { headingsWithoutLink }

import type { HeadingDefinition, HeadingWithoutLink } from '@brillout/docpress'

const headingsWithoutLink: HeadingWithoutLink[] = [
  {
    title: 'Page 2',
    url: '/page-2'
  }
]

const headings: HeadingDefinition[] = [
  {
    level: 1,
    title: 'Overview',
    titleEmoji: 'compass'
  },
  {
    level: 2,
    title: 'Introduction',
    titleDocument: 'Vike Demo',
    url: '/'
  },
  {
    level: 2,
    title: 'About',
    url: '/about'
  },
  {
    level: 1,
    title: 'Another Section',
    titleEmoji: 'seedling'
  },
  {
    level: 2,
    title: 'Page 1',
    url: '/page-1'
  }
]
