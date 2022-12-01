import { PureComponent } from 'react'
import { PropTypes } from '../../family'
import { Tree } from '../utils'

import './ParamsEditor.sass'
import { cloneDeep, uniqueId } from 'lodash'

import SortableTreeTable from './SortableTreeTable'
import { filterProperties, getMockData } from '../JSONEditor/JSONEditorUtils'

const DefaultFieldData = {
  name: '', // 字段名
  type: 'String', // 数据类型
  value: '', // 字段值
  description: '', // 描述
  moduleId: undefined,
  repositoryId: undefined,
}

class ParamsEditor extends PureComponent<any, any> {
  static propTypes = {
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array,
    interfaceId: PropTypes.number.isRequired,
    editable: PropTypes.bool.isRequired,
    /** optional */
    bodyOption: PropTypes.string,
    posFilter: PropTypes.number,
  }
  // static contextTypes = {
  //   // handleAddMemoryProperty: PropTypes.func.isRequired,
  // }
  constructor(props: any) {
    super(props)
    this.state = {
      highlightId: undefined,
      // createProperty: false,
      // createChildProperty: false,
      // previewer: props.scope === 'response',
      // importer: false,
    }
  }

  render() {
    const {
      editable,
      // itf,
      scope,
      autoMock = true,
      properties = [],
      interfaceId,
      bodyOption,
      posFilter,
    } = this.props

    if (!interfaceId) {
      return null
    }

    const scopedProperties = cloneDeep(
      filterProperties(properties, scope, posFilter)
    ) // 数据需要深度克隆，不然会被子组件污染
    const json = autoMock ? getMockData(scopedProperties) : null

    return (
      <section className="ParamsEditor">
        <div className="header clearfix"></div>
        <div className="body">
          <SortableTreeTable
            schema={Tree.arrayToTree(scopedProperties)}
            data={json}
            bodyOption={bodyOption}
            editable={editable}
            highlightId={this.state.highlightId}
            interfaceId={interfaceId}
            /* 字段排序 */
            handleSortProperties={this.handleSortProperties}
            /* 修改字段 */
            handleChangeProperty={this.handleChangeProperty}
            handleChangePropertyField={
              this.handleChangePropertyField
            }
            /* 删除字段 */
            handleDeleteMemoryProperty={
              this.handleDeleteMemoryProperty
            }
            /* 添加新字段 */
            handleClickCreatePropertyButton={
              this.handleClickCreatePropertyButton
            }
            handleClickCreateChildPropertyButton={
              this.handleClickCreateChildPropertyButton
            }
          />
        </div>
        <div className="footer"></div>
      </section>
    )
  }
  /**
     * 添加字段
     */
  handleClickCreatePropertyButton = () => {
    this.handleClickCreateChildPropertyButton()
  }
  /**
     * 添加子元素字段
     * @param parent
     */
  handleClickCreateChildPropertyButton = (parent: any = { id: -1 }) => {
    const { handleAddMemoryProperty } = this.props
    const { scope, interfaceId } = this.props
    const childId = uniqueId('memory-')
    const child = {
      ...DefaultFieldData,
      id: childId,
      interfaceId,
      scope,
      parentId: parent.id,
      pos: scope === 'request' ? this.props.posFilter : undefined,
    }
    this.setState({
      highlightId: childId,
    })
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
  handleChangePropertyField = (id: number, key: any, value: any) => {
    const { handleChangeProperty } = this.props
    const { properties } = this.props
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, [key]: value })
  }
  /**
     * 修改一个字段
     * @param id
     * @param value
     */
  handleChangeProperty = (id: number, value: any) => {
    const { properties, handleChangeProperty } = this.props
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, ...value })
  }
  /**
     * 删除一个字段
     * @param e
     * @param property
     */
  handleDeleteMemoryProperty = (e: any, property: any) => {
    e.preventDefault()
    const { handleDeleteMemoryProperty } = this.props
    handleDeleteMemoryProperty(property)
  }
  /**
     * 拖拽排序
     * @param _
     * @param sortable
     */
  handleSortProperties = (_: any, sortable: any) => {
    const { properties } = this.props
    const ids = sortable.toArray()
    ids.forEach((id: number, index: any) => {
      const property = properties.find(
        (item: any) => item.id === id || item.id === +id
      )
      property.priority = index + 1
    })
  }
}

export default ParamsEditor
