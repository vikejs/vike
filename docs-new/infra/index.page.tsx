import React from 'react'
import { Header } from '../Header'
import { Features } from '../features/Features'

export { LandingPage }

function LandingPage() {
  return (
    <>
      <Header style={{ padding: '50px 70px', paddingBottom: 70 }} />
      <Features
        style={{ marginTop: 0, padding: '0 30px' }}
        styleLineTop={{ paddingBottom: 45 }}
        styleLineBottom={{ marginTop: 40, marginBottom: -70 }}
      />
    </>
  )
}
