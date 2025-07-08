export { LoadingComponent }

import React from 'react'
import './LoadingComponent.css'

// Copied of: https://github.com/vikejs/vike-react/tree/main/packages/vike-react/src/components/Loading.tsx
// Permalink: https://github.com/vikejs/vike-react/blob/3913104da601bbfe712f31e50e907eef5aecf5e3/packages/vike-react/src/components/Loading.tsx
function LoadingComponent() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
        borderRadius: '5px',
        backgroundSize: '200% 100%',
        animation: '1.3s vike-react-shine linear infinite',
        aspectRatio: '2.5/1',
      }}
    />
  )
}
