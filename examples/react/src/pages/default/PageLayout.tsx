import React from 'react'

export { PageLayout }

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>Wrapped</div>
      {children}
    </>
  )
}
