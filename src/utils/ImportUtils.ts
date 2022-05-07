/*
 * @Author: xia xian
 * @Date: 2021-12-27 18:17:38
 * @LastEditors: xia xian
 * @LastEditTime: 2022-01-13 15:28:12
 * @Description: import convert tools
 */
import { IMPORT_TYPE } from '../components/repository/ImportSwaggerRepositoryForm'
import { BODY_OPTION } from '../components/editor/InterfaceSummary'
import { parse, ReflectionObject, Root } from 'protobufjs'
import JSON5 from 'json5'
export enum POS_OPTION {
  HEAD = 1,
  QUERY = 2,
  BODY = 3,
}
const PB_TYPES: {
  [key: string]: string
} = {
  double: 'number',
  float: 'number',
  int32: 'number',
  int64: 'string',
  uint32: 'number',
  uint64: 'string',
  sint32: 'number',
  sint64: 'string',
  fixed32: 'number',
  fixed64: 'string',
  sfixed32: 'number',
  sfixed64: 'string',
  bool: 'boolean',
  string: 'string',
  bytes: 'string',
}
export function convert(data, type: number) {
  if (type === IMPORT_TYPE.YAPI) {
    return convertFromYapi(JSON5.parse(data))
  } else if (type === IMPORT_TYPE.PB3) {
    return convertFromPb3(data)
  }
  return JSON5.parse(data)
}
export function convertFromYapi(data) {
  let id = 1
  const result = data.map(mod => {
    return {
      name: mod.name,
      description: mod.desc,
      interfaces: mod.list?.map(itl => {
        const { req_query, req_headers, req_params, res_body, res_body_type, req_body_form, req_body_type, req_body_other } = itl
        let bodyOption = null
        const propertyList = []
        const requiredSet = new Set()
        const insertProperty = (el, scope, pos = POS_OPTION.QUERY) => {
          const { name, required } = el
          const isNotRoot = name !== '__root__'
          if (Array.isArray(required)) {
            required.forEach(x => requiredSet.add(x))
          }
          const { rule, value } = getYapiMock(el)
          const item = {
            id: id++,
            scope: scope,
            pos,
            name: el.name,
            rule,
            description: el.desc || el.description,
            value,
            required: el.required === '1' || requiredSet.has(el.name),
            type: getYapiType(el.type),
            parentId: el.parentId || -1,
          }
          if (item.name === '__items__') {
            item.id = item.parentId
          }
          if (el.type === 'object') {
            const { properties } = el
            // eslint-disable-next-line guard-for-in
            for (const key in properties) {
              const objItem = properties[key]
              if (isNotRoot) {
                objItem.parentId = item.id
              }
              objItem.name = key
              insertProperty(objItem, scope, pos)
            }
          } else if (el.type === 'array') {
            // 解析一层,二维以上数组拍平处理
            let arrItem = el.items
            if (arrItem.type === 'object') {
              arrItem.name = '__items__'
              arrItem.parentId = item.id
              insertProperty(arrItem, scope, pos)
            } else {
              let str = '['
              let suffix = ']'
              while (arrItem.items) {
                arrItem = arrItem.items
                str += '['
                suffix += ']'
              }
              const { value } = getYapiMock(arrItem)
              if (value) {
                str += isNaN(parseInt(value, 10)) ? `"${value}"` : value
              }
              str += suffix
              item.value = str
              item.description = arrItem.description
            }
          }
          if (isNotRoot && item.name !== '__items__') {
            propertyList.push(item)
          }
        }
        // handle headers
        req_headers.forEach(el => {
          insertProperty(el, 'request', POS_OPTION.HEAD)
        })
        // handle request
        req_query.forEach(el => {
          insertProperty(el, 'request')
        })
        // params in path
        req_params.forEach(el => {
          el.required = '1'
          insertProperty(el, 'request')
        })
        // params in body
        if (req_body_form.length || req_body_other) {
          switch (req_body_type) {
            case 'form': bodyOption = BODY_OPTION.FORM_URLENCODED; break
            case 'json': bodyOption = BODY_OPTION.FORM_DATA; break
            case 'raw': bodyOption = BODY_OPTION.RAW; break
            case 'file': bodyOption = BODY_OPTION.BINARY; break
            default: break
          }
          if (req_body_form.length) {
            req_body_form.forEach(el => {
              insertProperty(el, 'request', POS_OPTION.BODY)
            })
          } else if (req_body_other) {
            if (req_body_type === 'json') {
              const reqData = JSON5.parse(req_body_other)
              reqData.name = '__root__'
              insertProperty(reqData, 'request', POS_OPTION.BODY)
            } else {
              insertProperty({
                default: req_body_other,
                name: 'data',
              }, 'request', POS_OPTION.BODY)
            }
          }
        }
        // handle response
        if (res_body_type === 'raw') {
          insertProperty({
            name: 'data',
            default: res_body,
          }, 'response')
        } else if (res_body) {
          const resData = JSON5.parse(res_body)
          resData.name = '__root__'
          insertProperty(resData, 'response')
        }
        return {
          bodyOption,
          name: itl.title,
          description: itl.desc,
          url: itl.path,
          method: itl.method,
          properties: propertyList,
        }
      }),
    }
  })
  return { modules: result }
}
function getYapiType(type: string) {
  if (type === 'text' || type === 'file' || !type) {
    return 'String'
  }
  return type === 'integer' ? 'Number' : type.substring(0, 1).toUpperCase() + type.substring(1)
}
function getYapiMock(el) {
  const { type, mock, format } = el
  const min = el.minimum || el.minLength || el.minItems || ''
  const max = el.maximum || el.maxLength || el.maxItems || ''
  const flag = min && max
  const rule = `${min}${flag ? '-' : ''}${max}`
  let mockVal = mock ? mock.mock : ''
  if (/^@.*/.test(mockVal)) {
    mockVal += '()'
  }
  let value = mockVal || el.default || el.example || ''
  if (el.enum) {
    value = `[${el.enum}]`
  }
  switch (format) {
    case 'date-time': value = '@datetime()'; break
    case 'date': value = '@date()'; break
    case 'email': value = '@email()'; break
    case 'ipv4': case 'ipv6': value = '@ip()'; break
    case 'uri': value = '@url()'; break
    case 'hostname': value = '@domain()'; break
    default: break
  }
  if (!value && !rule) {
    switch (type) {
      case 'number': case 'integer':
        value = `@integer()`
        break
      case 'string': case undefined:
        value = `@string()`
        break
      case 'boolean':
        value = '@boolean()'
        break
      default: break
    }
  }
  return { rule, value }
}
export function convertFromPb3(data) {
  const res = parse(data, { keepCase: true, alternateCommentMode: true, preferTrailingComment: true })
  let root: Root | ReflectionObject = res.root
  if (res.package) {
    root = res.root.lookup(res.package)
  }
  const { services, types } = parseNested(root.toJSON({ keepComments: true }), {}, {})
  let id = 1
  const result = {
    name: res.package || 'package',
    interfaces: [],
  }
  Object.keys(services).forEach(
    (name) => {
      const mod = services[name]
      Object.keys(mod.methods).forEach(itfName => {
        const itf = mod.methods[itfName]
        const propertyList = []
        const insertProperty = (name, scope, parentId) => {
          const propertyObj = types[name]
          if (propertyObj) {
            if (propertyObj.fields) {
              Object.keys(propertyObj.fields).forEach(key => {
                const field = propertyObj.fields[key]
                const { rule, comment, type } = field
                const idx = id++
                if (types[type]) {
                  insertProperty(type, scope, idx)
                }
                const mockType = PB_TYPES[type]
                const item = {
                  id: idx,
                  scope: scope,
                  pos: POS_OPTION.QUERY,
                  name: key,
                  description: comment,
                  value: mockType ? `@${mockType === 'number' ? 'integer' : mockType}()` : '',
                  required: rule === 'required',
                  type: (types[type] || !mockType) ? 'object' : mockType,
                  parentId,
                }
                if (rule === 'repeated') {
                  item.type = 'array'
                  if (!types[type]) {
                    item.value = `[${item.value}]`
                  }
                }
                propertyList.push(item)
              })
            } else if (propertyObj.values) {
              const { values, comment } = propertyObj
              const item = {
                id: id++,
                scope: scope,
                pos: POS_OPTION.QUERY,
                name,
                description: comment,
                value: `[${Object.values(values)}]`,
                required: false,
                rule: 1,
                type: 'array',
                parentId,
              }
              propertyList.push(item)
            }
          }
        }
        insertProperty(itf.requestType, 'request', -1)
        insertProperty(itf.responseType, 'response', -1)
        const itfItem = {
          name: itfName,
          description: itf.comment || '',
          url: `${res.package ? res.package + '.': ''}${name}/${itfName}`,
          method: 'post',
          properties: propertyList,
        }
        result.interfaces.push(itfItem)
      })
    }
  )
  return { modules: [result] }
}
function parseNested(json, services, types) {
  const nested = json.nested
  if (nested) {
    Object.keys(nested)
      .forEach((name) => {
        const value = nested[name]
        if (value.methods) {
          services[name] = value
        } else {
          if (value.fields || value.values) {
            types[name] = value
          }
          if (value.nested) {
            parseNested(value, services, types)
          }
        }
      })
  }
  return { services, types }
}
