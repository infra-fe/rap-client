import { Interface, Property } from 'actions/types'
import { POS_TYPE } from 'components/editor/InterfaceSummary'
import { FreePropertyType, JSONType } from 'components/validator/types'
import { clone, cloneDeep, uniqueId, upperFirst } from 'lodash'
import Mock from 'mockjs'
import { Tree } from '../utils'
import { IJSONSchema, IProperty, ItfProperty, IValidateError } from './JSONEditorTypes'

/* const schema = {
  'title': 'Employee',
  'description': 'Object containing employee details',
  'type': 'object',
  'properties': {
    'firstName': {
      'title': 'First Name',
      'description': 'The given name.',
      'examples': [
        'John',
      ],
      'type': 'string',
    },
    'lastName': {
      'title': 'Last Name',
      'description': 'The family name.',
      'examples': [
        'Smith',
      ],
      'type': 'string',
    },
    'gender': {
      'title': 'Gender',
      'enum': ['male', 'female'],
    },
    'availableToHire': {
      'type': 'boolean',
      'default': false,
    },
    'age': {
      'description': 'Age in years',
      'type': 'integer',
      'minimum': 0,
      'examples': [28, 32],
    },
    'job': {
      '$ref': '/schemas/job',
    },
  },
  'additionalProperties': false,
  'required': ['firstName', 'lastName'],

  '$def': {
    'job': {
      '$id': '/schemas/job',
      'title': 'Job description',
      'type': 'object',
      'required': ['address'],
      'properties': {
        'company': {
          'type': 'string',
          'examples': [
            'ACME',
            'Dexter Industries',
          ],
        },
        'role': {
          'description': 'Job title.',
          'type': 'string',
          'examples': [
            'Human Resources Coordinator',
            'Software Developer',
          ],
          'default': 'Software Developer',
        },
        'address': {
          'type': 'string',
        },
        'salary': {
          'type': 'number',
          'minimum': 120,
          'examples': [100, 110, 120],
        },
      },
    },
  },
} */

const JSONSchemaTemplate: IJSONSchema = {
  /* 信息描述 */
  title: '',
  description: '',
  /* 数据定义 */
  type: 'object',
  properties: {},

  /* 字段约束 */
  additionalProperties: false, // 不能有未定义的字段
  required: [], // 必填写字段

  /* 子节点数据定义，如果字段为对象或者对象的数组，需要此扩展 */
  $def: {},
}

/**
 * 根据接口定义生成jsoneditor的配置参数
 * @param itf
 * @param scope
 * @param posFilter
 * @returns
 */
export function createJSONSchema(itf: Interface, scope?: 'request' | 'response', posFilter?: POS_TYPE) {

  const result: ItfProperty[] = cloneDeep(filterProperties(itf.properties, scope, posFilter))

  // const treeMap = toTreeMap(result)
  // const _jsonSchema = _createJSONSchema(treeMap, scope, -1, itf.name)

  let tree = Tree.arrayToTree(result)

  // 处理虚拟字段:__root__
  if (tree?.children?.length > 0) {
    for (const child of tree.children) {
      if (child.name === '__root__') {
        tree = child
        break
      }
    }
  }

  const schema = _createJSONSchemaByTree(tree.children, tree.name, tree.id, `${itf.name} ${scope}`, tree.type)

  return schema
}

/**
 * 通过递归的方法，构造JSON schema
 * @param treeMap
 * @param p_name
 * @param p_id
 * @param p_desc
 * @returns
 */
/* function _createJSONSchema(treeMap: { [propName: number]: ItfProperty }, p_name?: string, p_id?: number | string, p_desc?: string) {
  // 构造JSON schema规则
  const JSONSchema = cloneDeep(JSONSchemaTemplate) // 根据模版深度克隆
  const { properties, required: requiredFields, $def } = JSONSchema

  // 设置基本信息
  JSONSchema.title = p_name || 'all'
  JSONSchema.description = `${p_desc || ''} ${JSONSchema.title}`
  if (p_id !== -1) {
    JSONSchema.$id = `/schemas/${p_name}-${p_id}`
  }

  const items: ItfProperty[] = Object.values(treeMap)
  for (const item of items) {
    const { id, parentId, name, type, description, required, value, _children } = item
    if (parentId !== p_id) {
      continue
    }

    const type_lower = type.toLowerCase()
    if (!_children) {
      // 基本类型的字段
      properties[name] = {
        title: name,
        description: description,
        type: type_lower,
      }
      if (type_lower === 'regexp') {
        properties[name] = {
          ...properties[name],
          type: 'string',
          pattern: value,
        }
      }
      if (type_lower === 'function') {
        let value = ''
        try {
          // eslint-disable-next-line
          value = eval(`(${value})()`)
        } catch (e) {
          // 不用处理
        }
        properties[name] = {
          ...properties[name],
          type: typeof value,
        }
      }
    } else {
      // 对象(或对象数组)类型的字段
      const refKey = `${name}-${id}`
      if (type_lower === 'object') {
        properties[name] = {
          $ref: `/schemas/${refKey}`,
        }
      } else if (type_lower === 'array') {
        properties[name] = {
          type: type_lower,
          items: {
            $ref: `/schemas/${refKey}`,
          },
        }
      }

      $def[refKey] = _createJSONSchema(_children, name, id)
    }

    // 字段是否必填
    if (required) {
      requiredFields.push(name)
    }
  }

  return JSONSchema
} */

const allBaseTypes: string[] = ['string', 'number', 'boolean', 'null']

/**
 * 通过递归的方法，构造JSON schema
 * @param treeChildren
 * @param p_name
 * @param p_id
 * @param p_desc
 * @param p_type
 * @returns
 */
function _createJSONSchemaByTree(treeChildren: ItfProperty[], p_name: string, p_id: number | string, p_desc?: string, p_type?: string) {

  // 构造JSON schema规则
  const JSONSchema = cloneDeep(JSONSchemaTemplate) // 根据模版深度克隆
  const { properties, required: requiredFields, $def } = JSONSchema

  // 设置基本信息
  JSONSchema.title = p_name || 'all'
  JSONSchema.description = `${p_desc || ''} ${JSONSchema.title}`
  if (p_name === '__root__' && p_type) {
    // 根据虚拟字段类型进行调整类型
    JSONSchema.type = p_type.toLowerCase()

    if (JSONSchema.type === 'array' && treeChildren?.length > 0) {
      const refKey = `${p_name}-${p_id}`
      JSONSchema.items = {
        $ref: `/schemas/${refKey}`,
      }
      $def[refKey] = _createJSONSchemaByTree(treeChildren, p_name, p_id)
      return JSONSchema
    }
  }
  if (p_id !== -1) {
    JSONSchema.$id = `/schemas/${p_name}-${p_id}`
  }

  for (const item of treeChildren) {
    const { id, name, type, description, required, value, children } = item

    const type_lower = type.toLowerCase()
    if (children && children.length > 0) {
      // 对象(或对象数组)类型的字段
      const refKey = `${name}-${id}`
      if (type_lower === 'object') {
        properties[name] = {
          $ref: `/schemas/${refKey}`,
        }
      } else if (type_lower === 'array') {
        properties[name] = {
          type: !!required ? type_lower : [type_lower, 'null'],
          items: {
            $ref: `/schemas/${refKey}`,
          },
        }
      }

      $def[refKey] = _createJSONSchemaByTree(children, name, id)
    } else {
      // 基本类型的字段
      properties[name] = {
        title: name,
        description: description ?? '', // fix description为null，引起编辑器崩溃
        type: type_lower,
      }
      if (type_lower === 'regexp') {
        const strRegExp = _formatRegExpStr(value)

        properties[name] = {
          ...properties[name],
          type: 'string',
          pattern: strRegExp,
        }
      } else if (type_lower === 'function') {
        let type: string | string[] = ''
        try {
          const result = _createFunction(value)()

          type = _getTypeByValue(result)
        } catch (e) {
          type = allBaseTypes
        }

        properties[name] = {
          ...properties[name],
          type: type,
        }
      }

      if (!required) {
        // 非必填的array类型和object类型支持null
        const property = properties[name] as IProperty
        const currentType = property.type as string
        if (['array', 'object', 'string'].includes(currentType)) {
          properties[name] = {
            ...properties[name],
            type: [currentType, 'null'],
          }
        }
      }
    }

    // 字段是否必填
    if (required) {
      requiredFields.push(name)
    }
  }

  return JSONSchema
}

/**
 * 格式化正则字符串，去除头尾的'/'
 * @param strRegExp
 */
function _formatRegExpStr(strRegExp: string) {
  if (typeof strRegExp !== 'string') {
    return strRegExp
  }

  if (strRegExp.length > 1 && strRegExp.indexOf('/') === 0) {
    strRegExp = strRegExp.substring(1)
  }
  if (strRegExp.length > 0 && strRegExp.lastIndexOf('/') === strRegExp.length - 1) {
    strRegExp = strRegExp.substring(0, strRegExp.length - 1)
  }

  return strRegExp
}

/**
 * 进行函数字符串的运行，异常由使用者处理
 * @param strFn
 * @returns
 */
function _createFunction(strFn: string) {
  if (!strFn || typeof strFn !== 'string') {
    return
  }

  if (strFn.indexOf('(') === 0 || strFn.indexOf('function') === 0) {
    strFn = `(${strFn})()`
  }

  // eslint-disable-next-line
  const func = new Function(`return ${strFn}`)
  return func
}

/**
 * 根据value值判断其type
 * @param value
 * @returns
 */
function _getTypeByValue(value: any) {
  if (value === undefined || value === null) {
    return allBaseTypes
  } else if (Array.isArray(value)) {
    return 'array'
  } else {
    return typeof value
  }
}

/**
 * 根据接口定义生成默认json值
 * @param itf
 * @param scope
 * @param posFilter
 * @returns
 */
export function createJSONData(itf: Interface, scope?: 'request' | 'response', posFilter?: POS_TYPE) {

  const result: ItfProperty[] = cloneDeep(filterProperties(itf.properties, scope, posFilter))
  let jsonData = Tree.treeToJson(Tree.arrayToTree(result))

  // 处理虚拟字段:__root__
  if (jsonData.__root__) {
    jsonData = jsonData.__root__
  }


  return Mock.mock(jsonData)
}

/**
 * 从自定义获取mock值
 * @param properties
 * @returns
 */
export function getMockData(properties: Property[]) {
  const jsonData = getJSONData(properties)

  return Mock.mock(jsonData)
}

/**
 * 从自动定义直接获取json值
 * @param properties
 */
export function getJSONData(properties: Property[], removeRoot: boolean = false) {
  if (!properties?.length) {
    return null
  }

  let jsonData = Tree.treeToJson(Tree.arrayToTree(cloneDeep(properties)))

  if (removeRoot && jsonData.__root__) {
    jsonData = jsonData.__root__
  }

  return jsonData
}

/**
 * 过滤指定的字段
 * @param properties
 * @param scope
 * @param posFilter
 * @returns
 */
export function filterProperties(properties: Property[], scope?: string, posFilter?: POS_TYPE) {
  const result: Property[] = properties.filter((item) => {
    let matchScope = true
    let matchPos = true

    if (scope) {
      matchScope = (item.scope === scope)
    }
    if (posFilter) {
      matchPos = (item.pos === posFilter)
    }

    return matchScope && matchPos
  })

  return result
}

export function mockPropertiesValue(properties: Property[]) {
  for (const property of properties) {
    const { type, rule, value } = property
    const lower_type = type.toLowerCase()
    if (_haveMockRule(lower_type, rule, value)) {
      try {
        let valueRule: any = value

        if (lower_type === 'function') {
          valueRule = _createFunction(valueRule)
        } else if (lower_type === 'regexp' || value.indexOf('/') === 0) {
          valueRule = _formatRegExpStr(valueRule)
          valueRule = new RegExp(valueRule)
        }

        const mockKey = (rule !== null && rule !== undefined) ? `result|${rule}` : 'result'

        const mockTemplate = { [mockKey]: valueRule }

        property.value = Mock.mock(mockTemplate).result
        delete property.rule // fix:请求参数的属性为`${name}|${rule}`
      } catch (e) {
        // 不做处理
      }
    }
  }

  return properties
}

function _haveMockRule(type: string, rule: string, value: string) {
  if (rule) {
    // 任意类型，设置了rule，则进行mock
    return true
  }
  if (type === 'regexp' && value) {
    // 正则类型需要有正则表达式
    return true
  }
  if (type === 'function' && value) {
    // 函数类型需要有内容
    return true
  }
  if (value && value.indexOf('@') === 0) {
    // 带有@的表达式
    return true
  }

  return false
}

/**
 * 私有方法，构造树结构
 * @param properties
 * @returns
 */
/* function toTreeMap(properties: Property[]) {
  const treeMap = Object.create(null)

  properties.forEach((item) => {
    const { id, parentId } = item

    // 构造map
    treeMap[id] = item

    // 构造tree
    if (parentId !== -1) {
      const parentNode = treeMap[parentId]
      const _children = parentNode?._children
      if (!_children) {
        parentNode._children = {
          [id]: item,
        }
      } else {
        _children[id] = item
      }
    }
  })

  return treeMap
} */

/**
 * 更新参数定义中的ID
 * @param properties
 */
export function updatePropertiesOfID(properties: Property[]) {
  if (properties?.length) {
    for (const property of properties) {
      const { id, parentId } = property
      if (typeof id === 'string') {
        property.id = `S_${id}`
      }
      if (typeof parentId === 'string') {
        property.parentId = `S_${parentId}`
      }

      delete property.rule // fix:请求参数的属性为`${name}|${rule}`
    }
  }
}

/**
 * 合并处理验证的错误信息，根据`keyword+dataPath`进行合并，合并结果添加到_fields中
 * @param errors
 * @returns
 */
export function mergeValidateErrors(errors: IValidateError[]): IValidateError[] {
  if (!Array.isArray(errors)) {
    return errors
  }

  const resultMap = Object.create(null) // {`${keyword}${dataPath}`:error}
  for (const error of errors) {
    const { keyword, dataPath, params } = error
    const key = `${keyword}${dataPath}`
    const field = keyword === 'additionalProperties' ? params['additionalProperty'] : params[keyword]
    if (!resultMap[key]) {
      const cloneError = clone(error)
      cloneError['_fields'] = []
      resultMap[key] = cloneError
    }
    resultMap[key]._fields.push(field)
  }


  return Object.values(resultMap)
}

export function createPropertiesFromJSON(json: JSONType<unknown> | Array<JSONType<unknown>>): FreePropertyType[] {
  if (!json) {
    return null
  }

  if (Array.isArray(json)) {
    json = { __root__: json }
  }

  const schema = Mock.toJSONSchema(json)
  if (!schema?.properties?.length) {
    return null
  }

  return parseSchema(schema)
}

function parseSchema(schema: Mock.MockjsToJSONSchemaRs, parentId: number | string = -1): FreePropertyType[] {
  const { properties } = schema

  const result: FreePropertyType[] = []
  properties.forEach(property => {
    const { name, template, properties } = property

    const type = upperFirst(property.type)
    const value = typeof template === 'string' ? template : JSON.stringify(template)

    const item = {
      id: uniqueId('import_'),
      name,
      value,
      parentId,
      scope: 'request',
      pos: POS_TYPE.BODY,
      type,
    }
    result.push(item)

    if (['Object', 'Array'].includes(type) && properties?.length) {
      result.push(...parseSchema(property, item.id))
    }

  })

  return result
}
