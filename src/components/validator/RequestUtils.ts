import axios, { Method, AxiosRequestConfig } from 'axios'
import { InvokeParams, IBaseServerSettingData } from './types'
import { BODY_OPTION } from '../editor/InterfaceSummary'
import config from '../../config'

/**
 * 对axios的请求进行全局拦截
 */
/* axios.interceptors.request.use((config) => {
  // 请求之前可以用于检测
  return config
}, (error) => {
  // 请求失败的处理
  return Promise.reject(error)
}) */

/**
 * 对axios的响应进行全局拦截
 */
/* axios.interceptors.response.use((response) => {
  // 对响应数据进行处理
  return response
}, (error) => {
  // 对响应失败进行处理
  return Promise.reject(error)
}) */

const axiosConfig: AxiosRequestConfig = {
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  /* transformResponse: (data: any) => {
    return data
  }, */

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: (status: number) => {
    // 允许[200,600)的状态码通过，在调用逻辑里拦截
    return status >= 200 && status < 600
  },

  // 接口请求超时限制，要略大于额服务端代理超时设置
  timeout: 35 * 1000,
}

const XHRErrorType = {
  NetworkError_Protocol: 'NetworkError_Protocol', // 协议不匹配
  NetworkError_Connect: 'NetworkError_Connect', // 服务连接异常
}

interface XHRErrorInfo {
  type: string
  message?: string
}

/**
 * 调用第三方接口
 * @param invokeParams
 * @param useLib
 * @returns
 */
export async function invoke(invokeParams: InvokeParams, useLib: string = 'axios') {
  const { baseServer, requestBase } = invokeParams

  const protocolType = baseServer?.protocolType
  const byProxy = requestBase?.byProxy

  if (byProxy || protocolType === 'rpc') {
    // 使用代理方式调用第三方服务
    return await invokeByProxy(invokeParams)
  }

  if (protocolType === 'websocket') {
    // 使用websocket方式调用第三方服务
    invokeWS(invokeParams)
    return
  }

  if (useLib === 'axios') {
    return invokeHTTPUseAxios(invokeParams)
  }

  // 使用http方式调用第三方服务
  return await invokeHTTP(invokeParams)
}

export async function invokeHTTPUseAxios(invokeParams: InvokeParams) {
  const { url, method, headers, body, withCookie } = createFetchParams(invokeParams)
  // 检验url是否合法
  try {
    new URL(url)
  } catch (urlError) {
    throw new Error(`${urlError.message}. ${url}`)
  }

  let response = null
  try {
    response = await axios({
      ...axiosConfig,

      withCredentials: withCookie,

      url: url, // 接口完成地址，带query参数
      method: method as Method, // 接口调用方法
      headers, // 全局头信息和业务头信息
      data: body,
    })
  } catch (error) {
    const xhrErrorInfo = parseXHRError(error, invokeParams, { url, method })
    if (xhrErrorInfo?.type) {
      throw new Error(`${error.message}.${xhrErrorInfo?.message}`)
    } else {
      throw error
    }
  }

  if (response === null) {
    throw new Error('Response is Null')
  }

  // 判断HTTP状态，抛出定制的错误信息
  const { status, statusText, data } = response
  if (status >= 400) {
    let detail = statusText
    if (data) {
      try {
        detail = JSON.stringify(data)
      } catch (e) {
        detail = data
      }
    }

    throw new Error(`Request failed with status code ${status}: ${detail}`)
  }

  return data
}

function parseXHRError(error: Error, invokeParams: InvokeParams, xhrParams?: any): XHRErrorInfo {
  const { message: errMsg } = error
  const { useSSL } = invokeParams.baseServer
  const { url } = xhrParams || {}
  const { protocol } = global.location

  let type = ''
  let message = ''
  if (errMsg === 'Network Error') {
    // 服务端未连接
    const isSSL = protocol.indexOf('s') >= 0 || protocol.indexOf('S') >= 0
    if (useSSL && !isSSL) {
      type = XHRErrorType.NetworkError_Protocol
      message = 'Current page URL is HTTP,but invoke the HTTPS service.'
    } else if (!useSSL && isSSL) {
      type = XHRErrorType.NetworkError_Protocol
      message = 'Current page URL is HTTPS,but invoke the HTTP service.'
    } else {
      type = XHRErrorType.NetworkError_Connect
      message = `Please make sure the service is available. ${url}`
    }
  }

  return {
    type,
    message,
  }
}

export async function invokeHTTP(invokeParams: InvokeParams) {
  const { url, method, headers, body } = createFetchParams(invokeParams)

  const options = {
    method,
  }

  if (headers) {
    options['headers'] = headers
  }
  if (body) {
    options['body'] = body
  }

  const response = await fetch(url, options)
  return await response.json()
}

function createFetchParams(invokeParams: InvokeParams) {
  const { baseServer, globalHeaders, requestBase, headerParams, queryParams, bodyParams } = invokeParams

  const baseUrl = createBaseUrl(baseServer)
  const withCookie = !!baseServer?.withCookie
  const { method, path, bodyOption } = requestBase

  // 生成所有头信息
  let headers = globalHeaders || {}
  if (headerParams) {
    headers = {
      ...headers,
      ...headerParams,
    }
  }

  // 判断使用的连接符
  let connector = '?'
  if (path.indexOf('?') >= 0) {
    // 如果path上已经带有query参数，则使用'&'连接
    // 也就是说，可以在path添加调试参数
    connector = '&'
  }

  // 生成url
  let query = null
  if (queryParams) {
    const search = new URLSearchParams(queryParams)
    query = search.toString()
  }
  const url = `${baseUrl}${path}${query ? `${connector}${query}` : ''}`

  // 生成body
  let body = null
  if (bodyParams && !['GET', 'HEAD'].includes(method.toUpperCase())) {
    // 'GET'和'HEAD'不会携带body信息，避免污染头信息
    switch (bodyOption) {
      case BODY_OPTION.FORM_URLENCODED:
        const search = new URLSearchParams(bodyParams)
        body = search.toString()
        headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8'
        break
      case BODY_OPTION.FORM_DATA:
        // TODO 进行简单的转化，不考虑字段为数组或者对象类型
        const formData = new FormData()
        for (const key in bodyParams) {
          if (!bodyParams.hasOwnProperty(key)) {
            continue
          }

          let value = bodyParams[key]
          if (!(bodyParams instanceof Blob || bodyParams instanceof File || typeof value === 'string')) {
            try {
              value = JSON.stringify(value)
            } catch (e) {
              value = ''
            }
          }
          formData.append(key, value)
        }
        body = formData
        break
      case BODY_OPTION.RAW:
        try {
          body = JSON.stringify(bodyParams)
        } catch (e) {
          body = '{}'
        }
        headers['Content-type'] = 'application/json; charset=utf-8'
        break
      case BODY_OPTION.BINARY:
        // TODO 暂时这么实现，根据真实场景调整
        if (bodyParams instanceof Blob || bodyParams instanceof File) {
          body = bodyParams
        } else {
          try {
            const blob = new Blob([JSON.stringify(bodyParams)], { type: 'application/json; charset=utf-8' })
            body = blob
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('translate JSON to Blob error:', err)
          }
        }
        // headers['Content-type'] = 'application/octet-stream'
        break
      default:
        try {
          body = JSON.stringify(bodyParams)
        } catch (e) {
          body = '{}'
        }
        headers['Content-type'] = 'application/json; charset=utf-8'
        break
    }
  }

  return { url, method: method.toUpperCase(), headers, body, withCookie }
}

export function invokeWS(invokeParams: InvokeParams) {
  /* 未实现 */
}

export async function invokeByProxy(invokeParams: InvokeParams) {
  const { protocolType } = invokeParams.baseServer
  const { url, method, headers, body } = createFetchParams(invokeParams)

  let proxyServer = `${config.serve}/proxy`
  switch (protocolType) {
    case 'http':
      proxyServer = `${proxyServer}/restful`
      break
    case 'websocket':
      proxyServer = `${proxyServer}/websocket`
      break
    case 'rpc':
      proxyServer = `${proxyServer}/rpc`
      break
    default:
      proxyServer = `${proxyServer}/restful`
  }

  try {
    const response = await axios({
      ...axiosConfig,
      url: `${proxyServer}?target=${encodeURIComponent(url)}`, // 接口完成地址，带query参数
      method: method as Method, // 接口调用方法
      headers, // 全局头信息和业务头信息
      data: body,
    })

    return response?.data
  } catch (error) {
    throw error
  }
}

function createBaseUrl(baseServer: IBaseServerSettingData) {
  const { domain, port, basePath, protocolType, useSSL } = baseServer

  let protocol = null
  switch (protocolType) {
    case 'http':
      protocol = !!useSSL ? 'https' : 'http'
      break
    case 'websocket':
      protocol = !!useSSL ? 'wss' : 'ws'
      break
    case 'rpc':
      protocol = ''
      break
    default:
      protocol = !!useSSL ? 'https' : 'http'
      break
  }

  let host = `${domain || '127.0.0.1'}`
  if (port) {
    const isHTTPDefault = !useSSL && port === 80
    const isHTTPSDefault = useSSL && port === 443
    if (!(isHTTPDefault || isHTTPSDefault)) {
      host += (':' + port)
    }
  }

  let path = basePath || ''
  if (path.lastIndexOf('/') === path.length - 1) {
    path = path.substring(0, path.length - 1)
  }


  return `${protocol}://${host}${path}`
}

interface GetDefaultServerParams {
  repositoryId: string | number
  requestMethod: string
}

export function getDefaultServer(params: GetDefaultServerParams): IBaseServerSettingData {
  const { repositoryId, requestMethod } = params
  const server = config.serve as string

  const basePath = `/app/mock/${repositoryId}/${requestMethod.toLowerCase()}`
  let protocolType = 'http'
  let domain = 'localhost'
  let port = null
  let useSSL = false

  // 服务地址信息分割
  const serverInfos = server.toLowerCase().split(':')

  let protocolStr = ''
  let domainStr = ''
  let portStr = ''
  if (serverInfos.length === 1) {
    domainStr = serverInfos[0]
  } else if (serverInfos.length === 2) {
    if (['http', 'https', 'ws', 'wss'].includes(serverInfos[0])) {
      protocolStr = serverInfos[0]
      domainStr = serverInfos[1]
    } else {
      domainStr = serverInfos[0]
      portStr = serverInfos[1]
    }
  } else {
    protocolStr = serverInfos[0]
    domainStr = serverInfos[1]
    portStr = serverInfos[2]
  }

  // 处理协议信息
  switch (protocolStr) {
    case 'https':
      protocolType = 'http'
      useSSL = true
      break
    case 'http':
      protocolType = 'http'
      useSSL = false
      break
    case 'wss':
      protocolType = 'websocket'
      useSSL = true
      break
    case 'ws':
      protocolType = 'websocket'
      useSSL = false
      break
  }

  // 处理域名和端口
  if (domainStr.indexOf('//') === 0) {
    domainStr = domainStr.substring(2)
  }
  domain = domainStr
  port = portStr ? parseInt(portStr, 10) : null

  return {
    domain: domain,
    port: port,
    basePath: basePath,
    protocolType: protocolType,
    useSSL: useSSL,
    withCookie: false,
  }
}
