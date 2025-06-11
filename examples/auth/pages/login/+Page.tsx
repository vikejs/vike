export default Page

import React from 'react'
import { reload } from 'vike/client/router'
import { Button } from '../../components/Button'

function Page() {
  return (
    <>
      <h1>Log in</h1>
      <PresetButtons />
      <form onSubmit={onSubmit} style={{ marginTop: 10 }}>
        <Input id="username" />
        <Input id="password" type="password" />
        <Validation />
        <Button type="submit" style={{ marginTop: 20 }}>
          Login
        </Button>
      </form>
    </>
  )
}

function PresetButtons() {
  return (
    <>
      Fill in as:{' '}
      <Button onClick={() => fill('turing', "I'm the creator of the Turing Machine")}>Alan Turing (admin)</Button>{' '}
      <Button onClick={() => fill('neumann', "I'm the creator of the Von Neumann Architecture")}>
        John von Neumann (not admin)
      </Button>
    </>
  )
  function fill(username: string, password: string) {
    getHtmlInputElement('username').value = username
    getHtmlInputElement('password').value = password
  }
}

async function onSubmit(ev: React.FormEvent) {
  ev.preventDefault()
  const username = getHtmlInputElement('username').value
  const password = getHtmlInputElement('password').value
  const response = await fetch('/_auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: [['Content-Type', 'application/json']],
  })
  const { success } = await response.json()
  if (success) {
    await reload()
  } else {
    getHtmltElement('validation')!.style.display = 'block'
  }
}

function Validation() {
  return (
    <div style={{ color: 'red', display: 'none', marginTop: 5, marginBottom: -6 }} id="validation">
      Wrong username and/or password.
    </div>
  )
}

function Input({ id, ...props }: { id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: '0.91em' }}>{id}</span>
      <br />
      <input type="text" id={id} size={20} {...props}></input>
    </label>
  )
}

function getHtmlInputElement(id: string): HTMLInputElement {
  return document.querySelector(`input#${id}`)!
}
function getHtmltElement(id: string): HTMLElement {
  return document.querySelector(`#${id}`)!
}
