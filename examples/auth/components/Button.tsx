export { Button }

import React, { useEffect, useState } from 'react'

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let [disabled, setDisabled] = useState(true)
  useEffect(() => {
    setDisabled(false)
  })
  return <button type="button" disabled={disabled} {...props} />
}
