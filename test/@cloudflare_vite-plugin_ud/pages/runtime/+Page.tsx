export default Page

import React from 'react'
import { useData } from 'vike-react/useData'
import type { Data } from './+data'

function Page() {
  const { runtime, req, res } = useData<Data>()
  return <p>{`runtime: ${runtime}, req: ${req}, res: ${res}`}</p>
}
