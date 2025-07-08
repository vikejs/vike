export { TableStyle }

import React from 'react'
import './TableStyle.css'

function TableStyle({ children }: { children: React.ReactNode }) {
  return <div id="head-settings-table">{children}</div>
}
