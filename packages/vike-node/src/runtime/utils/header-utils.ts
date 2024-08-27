export { flattenHeaders, groupHeaders, parseHeaders }

import type { OutgoingHttpHeaders } from 'http'
import { HeadersProvided } from '../types.js'

function groupHeaders(headers: [string, string][]): [string, string | string[]][] {
  const grouped: { [key: string]: string | string[] } = {}

  headers.forEach(([key, value]) => {
    if (grouped[key]) {
      // If the key already exists, append the new value
      if (Array.isArray(grouped[key])) {
        ;(grouped[key] as string[]).push(value)
      } else {
        grouped[key] = [grouped[key] as string, value]
      }
    } else {
      // If the key doesn't exist, add it to the object
      grouped[key] = value
    }
  })

  // Convert the object back to an array
  return Object.entries(grouped)
}

function flattenHeaders(headers: OutgoingHttpHeaders): [string, string][] {
  const flatHeaders: [string, string][] = []

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v != null) {
          flatHeaders.push([key, String(v)])
        }
      })
    } else {
      flatHeaders.push([key, String(value)])
    }
  }

  return flatHeaders
}

function parseHeaders(headers: HeadersProvided): [string, string][] {
  const result: [string, string][] = []
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach((value_) => {
          result.push([key, value_])
        })
      } else {
        result.push([key, value])
      }
    })
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        value.forEach((value_) => {
          result.push([key, value_])
        })
      } else {
        result.push([key, value])
      }
    }
  }

  return result
}
