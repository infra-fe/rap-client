import { Translation } from 'react-i18next'
import { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from '../../family'
import { Tooltip } from '@mui/material'
import { GoPlus, GoTrashcan, GoChevronDown, GoChevronRight } from 'react-icons/go'

import { SmartTextarea, RSortable, CopyToClipboard } from '../utils'

import JSON5 from 'json5'
import classNames from 'classnames'
import { uniq } from 'lodash'

import { TYPES } from '../../utils/consts'
import { Property, RootState } from '../../actions/types'
import { elementInViewport } from '../../utils/ElementInViewport'
import { POS_TYPE, BODY_OPTION, formatBodyOption, getBodyOptionStr } from '../editor/InterfaceSummary'

import { SortableTreeTableHeaderProps, SortableTreeTableRowState, SortableTreeTableRowProps } from './SortableTreeTableTypes'

const SortableTreeTableHeader = (props: SortableTreeTableHeaderProps) => {
  const { editable, handleClickCreatePropertyButton } = props
  return (
    <Translation>
      {(t) => (
        <div className="SortableTreeTableHeader">
          <div className="flex-row">
            {/* DONE 2.1 每列增加帮助 Tip */}
            <div className="th operations">
              <Link
                to=""
                onClick={e => {
                  e.preventDefault()
                  handleClickCreatePropertyButton()
                }}
              >
                {editable && <GoPlus className="fontsize-14 color-6 freq" />}
              </Link>
            </div>
            <div className="th name">{t('Name')}</div>
            <div className="th type">{t('Type')}</div>
            <div className="th value">{t('Mock value')}</div>
            <div className="th desc">{t('Introduction')}</div>
          </div>
        </div>
      )}
    </Translation>
  )
}

/** Object Null 不需要 value */
function isNoValueType(type: string) {
  return ['Object', 'Null'].indexOf(type) > -1
}

const PropertyLabel = (props: any) => {
  const { pos, bodyOption } = props
  if (pos === 1) {
    return <span className="badge badge-danger">HEAD</span>
  } else if (pos === 3) {
    return (
      <>
        <span className="badge badge-primary">BODY</span>
        {bodyOption && <span style={{ color: '#CC0000' }}>{getBodyOptionStr(bodyOption)}</span>}
      </>
    )
  } else {
    return <span className="badge badge-secondary">QUERY</span>
  }
}

const getFormattedValue = (property: Property) => {
  const { type, value } = property
  if (['Array', 'Object', 'String'].includes(type) && value) {
    try {
      const formatted = JSON.stringify(JSON5.parse(value), undefined, 2)
      return formatted
    } catch (error) {
      return value ?? ''
    }
  }

  return value ?? ''
}

const getMockValue = (property: Property, data: any) => {
  const { type, name, value } = property

  let mockValue = data?.[name]
  if (['Array', 'Object'].includes(type) && mockValue) {
    try {
      mockValue = JSON.stringify(mockValue, undefined, 2)
    } catch (e) {
      // 数据转化失败
      mockValue = null
    }
  }
  if (['Array', 'Object', 'String'].includes(type) && (!mockValue && value)) {
    try {
      mockValue = JSON.stringify(JSON5.parse(value), undefined, 2)
    } catch (e) {
      // 数据转化失败
      mockValue = value
    }
  }


  return mockValue ?? value ?? ''
}

class SortableTreeTableRow extends Component<SortableTreeTableRowProps, SortableTreeTableRowState> {
  static displayName = 'SortableTreeTableRow'
  static whyDidYouRender = true
  focusNameInput: HTMLInputElement | undefined = undefined
  constructor(props: SortableTreeTableRowProps) {
    super(props)
    this.state = {
      property: { children: [] },
      childrenAdded: false,
      childrenExpandingIdList: [],
      interfaceId: -1,
    }
  }
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const derivedState = {
      interfaceId: nextProps.interfaceId,
      property: nextProps.property,
      childrenAdded: nextProps.property.children.length > prevState.property.children.length,
      childrenExpandingIdList:
        nextProps.interfaceId !== prevState.interfaceId
          ? nextProps.property.children.map((item: any) => item.id)
          : prevState.childrenExpandingIdList,
    }

    return derivedState
  }
  componentDidMount() {
    this.focusInput()
  }
  componentDidUpdate() {
    this.focusInput()
  }
  focusInput() {
    if (this.focusNameInput && this.state.childrenAdded) {
      this.focusNameInput.focus()
      if (!elementInViewport(this.focusNameInput)) {
        this.focusNameInput.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }
  }
  render() {
    const {
      property,
      data,
      isExpanding,
      interfaceId,
      editable,
      highlightId,
      bodyOption,

      handleChangeProperty,
      handleSortProperties,
      handleChangePropertyField,
      handleDeleteMemoryProperty,
      handleClickCreateChildPropertyButton,
    } = this.props
    return (
      isExpanding && (
        <RSortable
          group={property.depth}
          handle=".SortableTreeTableRow"
          filter=".ignore"
          preventOnFilter={false}
          disabled={!editable}
          onChange={handleSortProperties}
        >
          <div className={`RSortableWrapper depth${property.depth}`}>
            {property.children
              .sort((a: any, b: any) => a.priority - b.priority)
              .map((item: any) => {
                const childrenIsExpanding = this.state.childrenExpandingIdList.includes(item.id)
                return (
                  <div key={item.id} className="SortableTreeTableRow" data-id={item.id}>
                    <div className={classNames('flex-row', { highlight: item.id === highlightId })}>
                      <div className="td operations nowrap">
                        {(item.type === 'Object' || item.type === 'Array') && item.children && item.children.length ?
                          (<Link to=""
                            onClick={e => {
                              e.preventDefault()
                              this.setState(prev => ({
                                ...prev,
                                childrenExpandingIdList: childrenIsExpanding
                                  ? prev.childrenExpandingIdList.filter(id => id !== item.id)
                                  : [...prev.childrenExpandingIdList, item.id],
                              }))
                            }}>
                            {childrenIsExpanding
                              ? (<GoChevronDown className="fontsize-14 color-6" />)
                              : (<GoChevronRight className="fontsize-14 color-6" />)
                            }
                          </Link>) : null}
                        {editable && (
                          <>
                            {item.type === 'Object' || item.type === 'Array'
                              ? (<Link to=""
                                onClick={e => {
                                  e.preventDefault()
                                  handleClickCreateChildPropertyButton(item)
                                  this.setState(prev => ({
                                    ...prev,
                                    childrenExpandingIdList: uniq([
                                      ...prev.childrenExpandingIdList,
                                      item.id,
                                    ]),
                                  }))
                                }}>
                                <GoPlus className="fontsize-14 color-6" />
                              </Link>) : null}
                            <Link to="" onClick={e => handleDeleteMemoryProperty(e, item)}>
                              <GoTrashcan className="fontsize-14 color-6" />
                            </Link>
                          </>
                        )}
                      </div>
                      <div className={`td payload name depth-${item.depth} nowrap`}>
                        {!editable ? (
                          <>
                            <CopyToClipboard text={item.name} type="right">
                              <span className="name-wrapper nowrap">
                                {item.pos === POS_TYPE.BODY && item.scope === 'request' ? (
                                  <Tooltip title={formatBodyOption(bodyOption ?? BODY_OPTION.RAW)}>
                                    <span>{item.name}</span>
                                  </Tooltip>
                                ) : item.name}
                              </span>
                            </CopyToClipboard>
                            {item.scope === 'request' && item.depth === 0 ? (
                              <div style={{ margin: '1px 0 0 3px' }}>
                                <PropertyLabel pos={item.pos} bodyOption={bodyOption} />
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <input className="form-control editable ignore"
                            ref={(input: HTMLInputElement) => {
                              if (item.id === highlightId) {
                                this.focusNameInput = input
                              }
                            }}
                            value={item.name || ''}
                            onChange={e => {
                              handleChangePropertyField(item.id, 'name', e.target.value)
                            }}
                            onKeyPress={e => {
                              if (e.ctrlKey === true && e.charCode === 13) {
                                // auto fill by name
                                // TODO:
                              }
                            }}
                            onBlur={e => {
                              const name = e.target.value
                              if (!name) {
                                // 失去焦点时，如果name为空则直接删除
                                handleDeleteMemoryProperty(e, item)
                              }
                            }}
                            spellCheck={false}
                            placeholder="" />
                        )}
                      </div>
                      <div className="td payload type">
                        {!editable
                          ? (<CopyToClipboard text={item.type}>
                            <span className="nowrap">{item.type}</span>
                          </CopyToClipboard>)
                          : (<select className="form-control editable" value={item.type}
                            onChange={e => {
                              const type = e.target.value
                              if (isNoValueType(type)) {
                                handleChangeProperty(item.id, {
                                  value: '',
                                  type,
                                })
                              } else {
                                handleChangeProperty(item.id, { type })
                              }
                            }}>
                            {TYPES.map(type => (
                              <option key={type} value={type}> {type}</option>
                            ))}
                          </select>)}
                      </div>
                      <div className="td payload value">
                        {!editable ? (
                          <CopyToClipboard text={item.value}>
                            <span className="value-container">{getFormattedValue(item)}</span>
                          </CopyToClipboard>
                        ) : (
                          <SmartTextarea
                            value={getMockValue(item, data)}
                            onChange={(e: any) =>
                              handleChangePropertyField(item.id, 'value', e.target.value)
                            }
                            disabled={isNoValueType(item.type) && !item.value}
                            rows="1"
                            className="form-control editable ignore"
                            spellCheck={false}
                            placeholder=""
                          />
                        )}
                      </div>
                      <div className="td payload desc">
                        {!editable ? (
                          <CopyToClipboard text={item.description}>
                            <span>{item.description}</span>
                          </CopyToClipboard>
                        ) : (
                          <SmartTextarea
                            value={item.description || ''}
                            onChange={(e: any) =>
                              handleChangePropertyField(item.id, 'description', e.target.value)
                            }
                            rows="1"
                            className="form-control editable ignore"
                            spellCheck={false}
                            placeholder=""
                          />
                        )}
                      </div>
                    </div>
                    {item.children && item.children.length ? (
                      <SortableTreeTableRow
                        editable={editable}
                        isExpanding={childrenIsExpanding}
                        highlightId={highlightId}
                        interfaceId={interfaceId}
                        property={item}
                        data={data?.[item.name]}
                        bodyOption={bodyOption}
                        handleSortProperties={handleSortProperties}
                        handleChangeProperty={handleChangeProperty}
                        handleChangePropertyField={handleChangePropertyField}
                        handleDeleteMemoryProperty={handleDeleteMemoryProperty}
                        handleClickCreateChildPropertyButton={handleClickCreateChildPropertyButton}
                      />
                    ) : null}
                  </div>
                )
              })}
          </div>
        </RSortable>
      )
    )
  }
}

function SortableTreeTable(props: any) {
  const {
    schema,
    data,
    editable,
    highlightId,
    interfaceId,
    bodyOption,

    handleSortProperties,
    handleChangeProperty,
    handleChangePropertyField,
    handleDeleteMemoryProperty,
    handleClickCreatePropertyButton,
    handleClickCreateChildPropertyButton,
  } = props

  return (
    <div className={`SortableTreeTable ${editable ? 'editable' : ''}`}>
      <SortableTreeTableHeader editable={editable} handleClickCreatePropertyButton={handleClickCreatePropertyButton} />
      <SortableTreeTableRow editable={editable} isExpanding={true}
        highlightId={highlightId}
        interfaceId={interfaceId}
        property={schema}
        data={data}
        bodyOption={bodyOption}
        handleSortProperties={handleSortProperties}
        handleChangeProperty={handleChangeProperty}
        handleChangePropertyField={handleChangePropertyField}
        handleDeleteMemoryProperty={handleDeleteMemoryProperty}
        handleClickCreateChildPropertyButton={handleClickCreateChildPropertyButton}
      />
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  copyId: state.copyId,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeTable)
