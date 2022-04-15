import React, { useContext } from 'react'

export { SsrDataProvider }
export { useSsrData }

const Context = React.createContext<Record<string, unknown>>(undefined as any)

function SsrDataProvider({ children }: { children: React.ReactNode }) {
  const ssrData = {}
  return <Context.Provider value={ssrData}>{children}</Context.Provider>
}

function useSsrData() {
  const pageContext = useContext(Context)
  return pageContext
}

