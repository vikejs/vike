export type NavItem = {
  level: 1,
  title: null,
  url: '/',
} | {
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
    title: null,
    url: '/'
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
