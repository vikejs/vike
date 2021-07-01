export type NavItem = {
  level: 1,
  title: string,
  url: null
} | {
  level: 2,
  title: string,
  url: string
}
export const navItems: NavItem[] = [
  {
    level: 1,
    title: 'Overview',
    url: null
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
    title: 'Guides',
    url: null
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching'
  },
]
