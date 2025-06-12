import { expect, describe, it } from 'vitest'
import { normalizeHeaders } from './normalizeHeaders.js'

describe('normalizeHeaders()', () => {
  it('works', () => {
    const myHeaders = new Headers()
    myHeaders.append('Accept-Encoding', 'deflate')
    myHeaders.append('acCepT-encODing', 'gzip')
    myHeaders.append('accept-encoding', 'br')
    myHeaders.append('cONTENT-tYPE', 'iMAge/jpeg')

    const headersNormalized = {
      'accept-encoding': 'deflate, gzip, br',
      'content-type': 'iMAge/jpeg',
    }
    const headers1 = normalizeHeaders(myHeaders)
    const headers2 = normalizeHeaders(headers1)
    const headers3 = normalizeHeaders(headersNormalized)
    expect(headers1).toStrictEqual(headersNormalized)
    expect(headers2).toStrictEqual(headersNormalized)
    expect(headers3).toStrictEqual(headersNormalized)

    const valuesNormalized = ['deflate', 'gzip', 'br']
    const values1 = getValues(myHeaders.get('Accept-Encoding')!)
    const values2 = getValues(headers2['accept-encoding']!)
    expect(values1).toStrictEqual(valuesNormalized)
    expect(values2).toStrictEqual(valuesNormalized)
  })

  it('Real world - Cloudflare Workers', () => {
    const { headersData, headersNormalized } = getCloudflareHeaders()
    const headersOriginal = new Headers(headersData as [string, string][])
    const headers1 = normalizeHeaders(headersOriginal)
    const headers2 = normalizeHeaders(headersData)
    const headers3 = normalizeHeaders(headersNormalized)
    expect(headers1).toStrictEqual(headersNormalized)
    expect(headers2).toStrictEqual(headersNormalized)
    expect(headers3).toStrictEqual(headersNormalized)
  })

  it('Real world - Express.js + curl', () => {
    const headersOriginal = { host: 'localhost:3000', 'user-agent': 'curl/8.2.1', accept: '*/*' }
    const headers = normalizeHeaders(headersOriginal)
    expect(headers).toStrictEqual(headersOriginal)
  })
  it('Real world - Express.js + Chrome', () => {
    const headersOriginal = {
      host: 'localhost:3000',
      connection: 'keep-alive',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
    }
    const headers = normalizeHeaders(headersOriginal)
    expect(headers).toStrictEqual(headersOriginal)
  })
})

function getValues(headerValue: string): string[] {
  return headerValue.split(',').map((v) => v.trimStart())
}

function getCloudflareHeaders() {
  return {
    headersData: [
      [
        'accept',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      ],
      ['accept-encoding', 'gzip, br'],
      ['accept-language', 'en-US,en;q=0.9,fr;q=0.8'],
      ['cache-control', 'max-age=0'],
      ['cf-connecting-ip', '92.195.254.253'],
      ['cf-ew-preview-server', 'https://609m86.cfops.net'],
      ['cf-ipcountry', 'DE'],
      ['cf-ray', '87df32115885a5fa'],
      ['cf-visitor', '{"scheme":"https"}'],
      ['connection', 'Keep-Alive'],
      ['host', 'vike_worker-example.brillout.workers.dev'],
      ['sec-ch-ua', '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"'],
      ['sec-ch-ua-mobile', '?0'],
      ['sec-ch-ua-platform', '"Linux"'],
      ['sec-fetch-dest', 'document'],
      ['sec-fetch-mode', 'navigate'],
      ['sec-fetch-site', 'none'],
      ['sec-fetch-user', '?1'],
      ['upgrade-insecure-requests', '1'],
      [
        'user-agent',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ],
      ['x-forwarded-proto', 'https'],
      ['x-real-ip', '92.195.254.253'],
    ],
    headersNormalized: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, br',
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
      'cache-control': 'max-age=0',
      'cf-connecting-ip': '92.195.254.253',
      'cf-ew-preview-server': 'https://609m86.cfops.net',
      'cf-ipcountry': 'DE',
      'cf-ray': '87df32115885a5fa',
      'cf-visitor': '{"scheme":"https"}',
      connection: 'Keep-Alive',
      host: 'vike_worker-example.brillout.workers.dev',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'x-forwarded-proto': 'https',
      'x-real-ip': '92.195.254.253',
    },
  }
}
