import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import {
  IJSONEditorProperty,
  IJSONEditorInstance,
  IJSONEditorOptions,
  IJSONSchema,
  IJSON,
} from './JSONEditorTypes'

import JED from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import './JSONEditor.sass'

const DefaultOptions: IJSONEditorOptions = {
  // schema: schema,
  mode: 'code',
  // modes: ['code', 'tree'],
}
// const DefaultData: IJSON = null

// const CacheTaskQueue: ICacheTask[] = []

function JSONEditor(props: IJSONEditorProperty, ref: any) {
  const { name, disabled, width, height, options } = props

  const [style, setStyle] = useState(null)

  const $editorContainerRef = useRef(null)
  const [schema, setSchema] = useState(null)
  const [data, setData] = useState(null)

  const [editor, setEditor] = useState(null)
  const [ajv, setAjv] = useState(null)

  // ================== 编辑器样式处理 ==================
  useEffect(() => {
    let cloneStyle = style || {}
    if (width) {
      cloneStyle = {
        ...cloneStyle,
        width: `${width}px`,
      }
    }
    if (height) {
      cloneStyle = {
        ...cloneStyle,
        height: `${height}px`,
      }
    }

    setStyle(cloneStyle)
  }, [width, height])
  // ================== //编辑器样式处理 ==================

  // ================== 编辑器初始化 ==================
  useEffect(() => {
    // mount和update
    if (!editor) {
      const containerDom = $editorContainerRef!.current

      const initOptions = options || DefaultOptions
      if (initOptions?.schema) {
        setSchema(initOptions.schema)
      }

      const initData = data

      const editor = new JED(containerDom, initOptions)
      editor.set(initData)
      setEditor(editor)

      switchEditable(editor)
      // handleCacheTaskQueue()
    } else {
      try {
        editor.update(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`${name} update error:`, err)
      }
    }
  }, [data])
  useEffect(() => {
    return () => {
      // unmount
      if (editor) {
        editor.destroy()
        setEditor(null)
      }
    }
  }, [editor])

  /**
     * 切换是否可编辑
     * @param jsonEditor
     */
  function switchEditable(jsonEditor?: any) {
    jsonEditor = jsonEditor || editor
    if (disabled) {
      jsonEditor?.setMode('preview')
    } else {
      jsonEditor?.setMode(options.mode)
    }
  }
  useEffect(() => {
    switchEditable()
  }, [disabled])
  // ================== //编辑器初始化 ==================

  // ================== 编辑器实例暴露方法 ==================
  /**
     * 设置校验规则
     * @param schema
     */
  const _setSchema = (schema: IJSONSchema) => {
    if (schema) {
      setSchema(schema)
      editor?.setSchema(schema)
    }
  }
  /**
     * 获取校验规则
     * @returns
     */
  const _getSchema = () => {
    return schema
  }
  /**
     * 设置json数据
     * @param json
     */
  const _setJSON = (json: IJSON) => {
    setData(json)
  }
  /**
     * 获取json数据
     * @returns
     */
  const _getJSON = () => {
    try {
      return editor?.get() ?? data
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('getJSON error:', err)
      return null
    }
  }
  /**
     * 进行json数据校验
     * @param json
     * @param schema
     * @returns
     */
  const _validate = (json?: IJSON, jsonSchema?: IJSONSchema) => {
    json = json ?? _getJSON()
    jsonSchema = jsonSchema ?? schema

    const json_ajv = _createAjv()
    const validate = json_ajv.compile(jsonSchema)

    if (!validate(json)) {
      return validate.errors
    }

    return null
  }

  const _createAjv = () => {
    let json_ajv = ajv
    if (!json_ajv) {
      // 参考文档：https://ajv.js.org/options.html
      json_ajv = JED.Ajv({
        allErrors: true, // 展示所有错误，默认只展示第一个错误
        // verbose: true, // 是否带有schema的定义
        // schemaId: 'auto', // 非ajv原有，jsonEditor添加的
        $data: true, // 可以对值的取值范围进行校验
      })
    }

    setAjv(json_ajv)
    return json_ajv
  }

  const imperativeHandle: IJSONEditorInstance = {
    setSchema: _setSchema,
    getSchema: _getSchema,
    setJSON: _setJSON,
    getJSON: _getJSON,
    validate: _validate,
  }
  useImperativeHandle(ref, () => imperativeHandle)
  // ================== //编辑器实例暴露方法 ==================

  return (
    <div className="jsoneditor-parent" style={style}>
      <div
        className={`jsoneditor-container ${disabled ? 'noTools' : ''}`}
        ref={$editorContainerRef}
      />
      {/* <div className={`jsoneditor-cover ${disabled ? 'show' : 'hide'}`}></div> */}
    </div>
  )
}
const JSONEditorWrapper = forwardRef(JSONEditor)

export default JSONEditorWrapper
