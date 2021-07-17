import React from 'react'

export { ContactUs }

function ContactUs() {
  const style: React.CSSProperties = {
    fontSize: '1.5em',
    padding: 20,
    textAlign: 'center',
    margin: 'auto',
    maxWidth: 1000
  }
  return (
    <p style={style}>
      Have a question? Want a feature? A tool integration is not working? Chat on{' '}
      <a href="https://discord.com/invite/qTq92FQzKb">Discord</a> or open a{' '}
      <a href="https://github.com/brillout/vite-plugin-ssr/issues/new">GitHub ticket</a>.
    </p>
  )
}
