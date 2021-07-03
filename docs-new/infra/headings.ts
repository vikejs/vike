type HeadingBase = {
  title: string
  level: number
  url?: string
  isActive?: boolean
}
export type Heading = HeadingBase &
  (
    | {
        level: 1
      }
    | {
        level: 2
        url: string
      }
  )
export const headings: Heading[] = [
  {
    level: 1,
    title: 'Overview'
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
    title: 'Get Started'
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
    title: 'Guides'
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching'
  }
]
