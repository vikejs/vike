import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'

export { SidePanel }

type Header = {
  title: string,
  level: number
  headers?: Header[]
}

const headers: Header[] = [
  { level: 1, title: 'Introduction' },
  { level: 1, title: 'Table of Contents' },
  {
    level: 1,
    title: 'Get Started',
    headers: [
      { level: 2, title: 'Tour' },
      { level: 2, title: 'Boilerplates' },
      { level: 2, title: 'Manual Install' }
    ]
  },
  { level: 1, title: 'Guides' },
  { level: 2, title: 'Routing' },
  { level: 2, title: 'Pre-rendering' },
  { level: 1, title: 'API' }
]

function SidePanel() {
  return (
    <>
      <SideHeader />
      <Navigation />
    </>
  )
}

function SideHeader() {
  const SIZE = 50
  return (
    <a
      style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', padding: 20 }}
      href="/"
    >
      <img src={iconPlugin} height={SIZE} width={SIZE} />
      <code
        style={{ backgroundColor: '#f4f4f4', borderRadius: 4, fontSize: '1.35em', padding: '2px 5px', marginLeft: 10 }}
      >
        vite-plugin-ssr
      </code>
    </a>
  )
}

function Navigation() {
  return <NavTree headers={headers} />
}

function NavTree({headers}: {headers?: Header[]}) {
  if( headers===undefined ) return null
  return (
    <>
      {headers.map(({ level, title, headers }) => {
        return (
          <div key={title}>
            <a className={"nav-h"+level} href={getHeaderUri(title)}>{title}</a>
            <NavTree headers={headers} />
          </div>
        )
      })}
    </>
  )
}

function getHeaderUri(title: string): string {
  return title.toLowerCase().split(/^[a-z]/).filter(Boolean).join('-')
}
