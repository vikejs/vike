export default LayoutDefault

import React from 'react'
import './LayoutDefault.css'
import { reload } from 'vike/client/router'
import { usePageContext } from 'vike-react/usePageContext'
import { Button } from '../components/Button'

function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Sidebar>
        <Links />
        <UserInfo />
      </Sidebar>
      <Content>{children}</Content>
    </Layout>
  )
}

function Links() {
  return (
    <>
      <a className="navitem" href="/">
        Home
      </a>
      <a className="navitem" href="/admin">
        Admin Panel
      </a>
      <a className="navitem" href="/account">
        Account
      </a>
    </>
  )
}

function UserInfo() {
  const pageContext = usePageContext()
  const { userFullName } = pageContext
  let content
  if (!userFullName) {
    content = (
      <>
        You are logged out.
        <br />
        {/*
        <a className="navitem" href="/login">
          <b>Login</b>
        </a>
        */}
      </>
    )
  } else {
    content = (
      <>
        Logged as <b>{userFullName}</b>
        <br />
        <Button onClick={logout}>Logout</Button>
      </>
    )
  }
  return (
    <div style={{ textAlign: 'center', fontSize: '0.92em', border: '1px solid black', padding: 10, marginTop: 10 }}>
      {content}
    </div>
  )
}
async function logout() {
  await fetch('/_auth/logout', { method: 'POST' })
  await reload()
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 1000,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 42,
        minWidth: 300,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
