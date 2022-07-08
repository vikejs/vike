import React from 'react'

export { PrerenderPreview }

function PrerenderPreview() {
  const colorFile = 'rgb(138, 180, 248)'
  const colorAction = 'rgb(19, 115, 86)'
  const colorPath = 'rgb(154, 160, 166)'
  // prettier-ignore
  return (
    <pre>
    <code className="language-custom" style={{backgroundColor: '#262626', color: 'white', overflowX: 'auto'}}>
      <span style={{color: '#aaa'}}>$</span> vite build {'\n'}
      <span style={{color: 'rgb(3, 191, 200)'}}>vite</span> <span style={{color: colorAction}}>building for production...</span>{'\n'}
      <span style={{color: colorAction}}>✓</span> 42 modules transformed.{'\n'}
      <span style={{color: 'rgb(3, 191, 200)'}}>vite-plugin-ssr</span> <span style={{color: colorAction}}>pre-rendering HTML...</span>{'\n'}
      <span style={{color: colorAction}}>✓</span> 3 HTML documents pre-rendered.{'\n'}
      <span style={{color: colorPath}}>dist/client/</span><span style={{color: colorFile}}>index.html</span>{'\n'}
      <span style={{color: colorPath}}>dist/client/</span><span style={{color: colorFile}}>about/index.html</span>{'\n'}
      <span style={{color: colorPath}}>dist/client/</span><span style={{color: colorFile}}>404.html</span>
    </code>
    </pre>
  )
}
