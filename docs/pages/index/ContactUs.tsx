import React from 'react'

export { ContactUs }

function ContactUs() {
  const style: React.CSSProperties = {
    fontSize: '1.5em',
    textAlign: 'center',
    margin: 'auto',
    padding: 'var(--header-padding)',
    maxWidth: 'var(--header-max-width)'
  }
  return (
    <p style={style}>
      Have a question? Want a feature? A tool integration is not working? Chat on{' '}
      <a href="https://discord.com/invite/qTq92FQzKb">Discord</a> or open a{' '}
      <a href="https://github.com/brillout/vite-plugin-ssr/issues/new">GitHub ticket</a>.
    </p>
  )
}
