import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('')
  const send = () => {
    const { protocol, host } = window.location
    const ws = new WebSocket(`${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/ws`)
    ws.onopen = () => ws.send('hello')
    ws.onmessage = (event) => {
      setMessage(event.data)
      ws.close()
    }
  }
  return (
    <>
      <h1>WebSocket</h1>
      <button type="button" onClick={send}>
        Send
      </button>
      <p id="message">{message}</p>
    </>
  )
}
