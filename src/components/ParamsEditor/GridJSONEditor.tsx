import { useState } from 'react'
import { Tree } from '../utils'

import { uniqueId, cloneDeep } from 'lodash'

import SortableTreeTable from './SortableTreeTable'

import './ParamsEditor.sass'

const DefaultProperty = {
  scope: 'response',
  name: '',
  type: 'String',
  value: '',
  description: '',
  parentId: -1,
  interfaceId: undefined,
  moduleId: undefined,
  repositoryId: undefined,
}

export default function GridJSONEditor(props: any) {
  const {
    editable,
    scope,
    properties = [],
    interfaceId,
    bodyOption,
    posFilter,

    handleAddMemoryProperty,
    handleChangeProperty,
    handleDeleteMemoryProperty,
  } = props

  const [highlightId, setHighlightId] = useState(null)

  if (!interfaceId) {
    return null
  }

  // ================== 编辑器事件处理 ==================
  /**
     * 添加字段
     */
  const _handleClickCreatePropertyButton = () => {
    _handleClickCreateChildPropertyButton()
  }
  /**
     * 添加子元素字段
     * @param parent
     */
  const _handleClickCreateChildPropertyButton = (
    parent: any = { id: -1 }
  ) => {
    const childId = uniqueId('memory-')
    const child = {
      ...DefaultProperty,
      id: childId,
      interfaceId,
      scope,
      parentId: parent.id,
      pos: scope === 'request' ? posFilter : undefined,
    }
    setHighlightId(childId)
    handleAddMemoryProperty(child, () => {
      /** empty */
    })
  }
  /**
     * 修改一个字段
     * @param id
     * @param key
     * @param value
     */
  const _handleChangePropertyField = (id: number, key: any, value: any) => {
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, [key]: value })
  }
  /**
     * 修改一个字段
     * @param id
     * @param value
     */
  const _handleChangeProperty = (id: number, value: any) => {
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, ...value })
  }
  /**
     * 删除一个字段
     * @param e
     * @param property
     */
  const _handleDeleteMemoryProperty = (e: any, property: any) => {
    e.preventDefault()
    handleDeleteMemoryProperty(property)
  }
  /**
     * 拖拽排序
     * @param _
     * @param sortable
     */
  const _handleSortProperties = (_: any, sortable: any) => {
    const ids = sortable.toArray()
    ids.forEach((id: number, index: any) => {
      const property = properties.find(
        (item: any) => item.id === id || item.id === +id
      )
      property.priority = index + 1
    })
  }
  // ================== 编辑器事件处理 ==================

  return (
    <section className="ParamsEditor GridJSONEditor">
      <div className="header clearfix"></div>
      <div className="body">
        <SortableTreeTable
          schema={Tree.arrayToTree(cloneDeep(properties))}
          bodyOption={bodyOption}
          editable={editable}
          highlightId={highlightId}
          interfaceId={interfaceId}
          /* 字段排序 */
          handleSortProperties={_handleSortProperties}
          /* 修改字段 */
          handleChangeProperty={_handleChangeProperty}
          handleChangePropertyField={_handleChangePropertyField}
          /* 删除字段 */
          handleDeleteMemoryProperty={_handleDeleteMemoryProperty}
          /* 添加新字段 */
          handleClickCreatePropertyButton={
            _handleClickCreatePropertyButton
          }
          handleClickCreateChildPropertyButton={
            _handleClickCreateChildPropertyButton
          }
        />
      </div>
      <div className="footer"></div>
    </section>
  )
}
