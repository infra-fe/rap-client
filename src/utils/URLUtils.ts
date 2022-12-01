import config from '../config'

export function getRelativeUrl(url: any) {
  if (url instanceof RegExp) {
    return url
  }
  if (!url) {
    return ''
  }
  if (url.indexOf('http://') > -1) {
    url = url.substring(url.indexOf('/', 7) + 1)
  } else if (url.indexOf('https://') > -1) {
    url = url.substring(url.indexOf('/', 8) + 1)
  }
  if (url.charAt(0) !== '/') {
    url = '/' + url
  }
  return url
}


export function getRelativeBathPath(url: string) {
  if (!url) {
    return ''
  }
  url = url.replace(/https?:\/\//g, '')
  if (url.indexOf('?') > -1) {
    url = url.substring(0, url.indexOf('?'))
  }
  if (url.charAt(0) !== '/') {
    url = '/' + url
  }
  const lastIdx = url.length - 1
  if (url.charAt(lastIdx) === '/') {
    url = url.substring(0, lastIdx)
  }
  return url
}

/**
 * 把URL或者cURL解析为JSON
 * @param curl
 * @returns
 */
export interface IGetCurlParamsResult {
  isCover?: boolean
  url: string
  name: string
  method: string
  hostname: string
  port: string
  pathname: string
  protocol: string
  description: string
  header: Array<{
    key: string
    value: string
  }>
  headers: {
    [key: string]: string
  }
  query: {
    [key: string]: string | string[]
  }
  body: {
    mode?: string
    raw?: string
    formdata?: string
    urlencoded?: string
    [key: string]: string
  }
}

export async function getCurlParams(curl: string): Promise<IGetCurlParamsResult> {
  const response = await fetch(`${config.serve}/validate/convertCURL`, {
    method: 'POST',
    body: JSON.stringify({ curl }),
    headers: { 'Content-Type': 'application/json' },
  })

  const result = await response.json()

  return result?.data as IGetCurlParamsResult
}
