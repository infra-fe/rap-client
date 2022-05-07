
import { Property } from 'actions/types'

export interface IJSONSchema {
  $id?: string
  title?: string
  description?: string
  type: string | string[]
  items?: IProperty | IRefProperty
  properties: { [propName: string]: IProperty | IRefProperty }
  additionalProperties?: boolean
  required?: string[]
  $def?: { [propName: string]: IJSONSchema }
}

export interface IProperty {
  title?: string
  description?: string
  type: string | string[]
  enum?: any[]
  default?: any
  minimum?: any
  items?: IProperty | IRefProperty
  pattern?: string
}

export interface IRefProperty {
  $ref: string
}

export interface ItfProperty extends Property {
  // _children?: { [propName: number]: ItfProperty }
  children?: ItfProperty[]
}

export interface IJSONEditorOptions {
  mode?: string
  modes?: string[]
  schema?: IJSONSchema
}

export interface IJSONEditorProperty {
  name?: string
  // 样式相关属性
  disabled?: boolean
  width?: number
  height?: number

  // 编辑器操作相关属性
  options?: IJSONEditorOptions
}

export interface IJSON {
  [propName: string | number]: any
}

export interface ICacheTask {
  method: 'setSchema' | 'setData'
  params: any
}

export interface IJSONEditorInstance {
  // 通过ref可调用的方法
  setJSON: (json: IJSON) => void
  getJSON: () => IJSON | null

  setSchema: (schema: IJSONSchema) => void
  getSchema: () => IJSONSchema | null

  /**
   * JSON数据校验，不会根据参数更改editor的原有设置:
   * 1）`validate()`：使用已设置的json和schema进行校验
   * 2）`validate(json)`：使用传入的json和已设置的schema进行校验
   * 3）`validate(null,schema)`：使用已设置的json和传入的schema进行校验
   * 4）`validate(json,schema)`：使用传入的json和schema进行校验
   */
  validate: (json?: IJSON, schema?: IJSONSchema) => any
}

export interface IValidateError {
  keyword: string
  message: string
  dataPath: string
  schemaPath: string
  params: { [propName: string]: any }
  _fields?: string[]
}
