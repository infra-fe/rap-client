import { Translation } from 'react-i18next'
import React, { Component, PureComponent } from 'react'
import { Link, PropTypes } from '../../family'
import {
  Tree,
  RModal,
  RSortable,
  CopyToClipboard,
} from '../utils'
import { mockRuleGenerator, TYPES } from '../../utils/consts'
import PropertyForm from './PropertyForm'
import Importer from './Importer'
import Previewer from './InterfacePreviewer'
import {
  GoPlus,
  GoTrashcan,
  GoQuestion,
  GoChevronDown,
  GoChevronRight,
} from 'react-icons/go'
import { AiOutlineCopy } from 'react-icons/ai'
import './PropertyList.sass'
import { ButtonGroup, Button, Checkbox, Tooltip, Autocomplete, styled, TextField, Box, IconButton, Popper } from '@mui/material'
import classNames from 'classnames'
import _ from 'lodash'
import Mock from 'mockjs'
import JSON5 from 'json5'
import { elementInViewport } from 'utils/ElementInViewport'
import {
  POS_TYPE,
  BODY_OPTION,
  formatBodyOption,
  getBodyOptionStr,
} from './InterfaceSummary'
import { Interface, Property, RootState } from 'actions/types'
import { FaPaste } from 'react-icons/fa'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { DefaultStorage, ExpireTimeEnum } from 'utils/Storage'
import i18n from '../../i18n'
import { CgExpand } from 'react-icons/cg'
import { PropertyModalContext } from './InterfaceEditor'

const CssTextField = styled(TextField)({
  ' & .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent!important',
    },
    '& input': {
      fontSize: '12px',
    },
  },
})

const MAX_STRING_RULE = 10000 // NOTE: mockjs底层以for循环生成随机字符串，因此需要限制最大长度避免长时间循环，导致页面卡死
const filter = (arr: Property[], pos: POS_TYPE) =>
  arr
    .filter((item) => item.pos === pos)
    .sort((a, b) => a.priority - b.priority)
const mockProperty =
    process.env.NODE_ENV === 'development'
      ? () =>
        Mock.mock({
          'scope|1': ['request', 'response'],
          name: '@WORD(6)',
          'type|1': ['String', 'Number', 'Boolean'],
          'value|1': ['@INT', '@FLOAT', '@TITLE', '@NAME'],
          description: '@CSENTENCE',
          parentId: -1,
          interfaceId: '@NATURAL',
          moduleId: '@NATURAL',
          repositoryId: '@NATURAL',
        })
      : () => ({
        scope: 'response',
        name: '',
        type: 'String',
        value: '',
        description: '',
        parentId: -1,
        interfaceId: undefined,
        moduleId: undefined,
        repositoryId: undefined,
      })

export const RequestPropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

export const ResponsePropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

/** Object Null 不需要 value */
function isNoValueType(type: string) {
  return ['Object', 'Null'].indexOf(type) > -1
}

// DONE 2.2 请求属性有什么用？有必要吗？有，用于订制响应数据。
// DONE 2.2 如何过滤模拟 URL 中额外的请求属性？解析 URL 中的参数到请求属性列表吗？可以在响应数据中引用 配置的请求参数 和 URL 中的额外参数。
// DONE 2.2 支持对属性排序
// DONE 2.2 支持对模块排序
// DONE 2.2 支持对接口排序
// TODO 2.3 检测重复属性

class SortableTreeTableHeader extends Component<any, any> {
  handleCheckAll = () => {
    const { isCheckAll, handleChangeAllProperty } = this.props
    handleChangeAllProperty('required', !isCheckAll)
  }
  render() {
    const {
      editable,
      handleClickCreatePropertyButton,
      isCheckAll,
      root,
      handleChangeAllOption,
    } = this.props
    return (
      <Translation>
        {(t) => (
          <div className="SortableTreeTableHeader">
            <div className="flex-row">
              {/* DONE 2.1 每列增加帮助 Tip */}
              <div
                className="th operations"
                style={{
                  justifyContent: 'flex-end',
                  paddingRight: `${editable ? 20 : 10}`,
                }}
              >
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault()
                    handleClickCreatePropertyButton()
                  }}
                >
                  {editable && (
                    <GoPlus
                      className="fontsize-14 color-6 freq"
                      style={{ marginRight: '0.5rem' }}
                    />
                  )}
                </Link>
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault()
                    handleChangeAllOption()
                  }}
                >
                  {editable && (
                    <GoTrashcan className="fontsize-14 color-6 freq" />
                  )}
                </Link>
              </div>
              <div className="th name">{t('Name')}</div>
              <div
                className="th type"
                style={{ paddingLeft: '0' }}
              >
                <Checkbox
                  checked={isCheckAll}
                  disabled={
                    !editable || root.children.length === 0
                  }
                  onChange={this.handleCheckAll}
                  color="primary"
                />
                {t('Required')}
              </div>
              <div className="th type">{t('Type')}</div>
              {/* TODO 2.3 规则编辑器 */}
              <div className="th rule">
                {t('Generate rules')}
                <a
                  href="https://github.com/nuysoft/Mock/wiki/Syntax-Specification"
                  rel="noopener noreferrer"
                  className="helper"
                  target="_blank"
                >
                  <GoQuestion />
                </a>
              </div>
              <div className="th value">{t('Initial value')}</div>
              {/* 对象和数组也允许设置初始值 */}
              <div className="th desc">{t('Introduction')}</div>
            </div>
          </div>
        )}
      </Translation>
    )
  }
}

const PropertyLabel = (props: any) => {
  const { pos, itf } = props
  if (pos === 1) {
    return <span className="badge badge-danger">HEAD</span>
  } else if (pos === 3) {
    return (
      <>
        <span className="badge badge-primary">BODY</span>
        {itf?.bodyOption && (
          <span style={{ color: '#CC0000' }}>
            {getBodyOptionStr(itf.bodyOption)}
          </span>
        )}
      </>
    )
  } else {
    return <span className="badge badge-secondary">QUERY</span>
  }
}

// const PropertyArrow = (props: { property: any }) => {}

const getFormattedValue = (itf: any) => {
  if (
    (itf.type === 'Array' ||
            itf.type === 'Object' ||
            itf.type === 'String') &&
        itf.value
  ) {
    try {
      const formatted = JSON.stringify(
        JSON5.parse(itf.value),
        undefined,
        2
      )
      return formatted
    } catch (error) {
      return itf.value || ''
    }
  } else {
    return itf.value || ''
  }
}
interface SortableTreeTableRowState {
  property: {
    children: any[]
    [k: string]: any
  }
  interfaceId: number
  childrenAdded: boolean
  childrenExpandingIdList: number[]
}
interface SortableTreeTableRowProps {
  /** 当前层级是不是展开 */
  isExpanding: boolean
  interfaceId: number
  itf: Interface
  [k: string]: any
}
class SortableTreeTableRowWrapped extends Component<
SortableTreeTableRowProps,
SortableTreeTableRowState
> {
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
    return {
      interfaceId: nextProps.interfaceId,
      property: nextProps.property,
      childrenAdded:
                nextProps.property.children.length >
                prevState.property.children.length,
      childrenExpandingIdList:
                nextProps.interfaceId !== prevState.interfaceId
                  ? nextProps.property.children.map((item: any) => item.id)
                  : prevState.childrenExpandingIdList,
    }
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
  handleClickRow = (
    e:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.FocusEvent<HTMLDivElement, Element>,
    id: string
  ) => {
    if (this.props.editable) {
      e.stopPropagation()
      this.props.handleClickRow(id)
    }
  }
  handleShortKey = _.throttle(
    (e: React.KeyboardEvent<HTMLDivElement>, item: Property) => {
      if (this.props.editable) {
        const { id } = item
        const { ctrlKey, key } = e
        e.stopPropagation()
        if (ctrlKey) {
          switch (key) {
            case 'c':
              this.props.handleCopyProperty(id)
              break
            case 'v':
              this.props.handlePasteProperty(id)
              break
            case 'd':
              this.props.handleDeleteMemoryProperty(e, item)
              break
            case 'e':
              this.props.handleUnlockInterface()
              this.props.handleClickRow('')
              break
            case 's':
              this.props.handleClickRow('')
              break
            default:
              break
          }
        }
      }
    },
    300
  )
  render() {
    const {
      property,
      isExpanding,
      interfaceId,
      editable,
      handleClickCreateChildPropertyButton,
      highlightId,
      handleDeleteMemoryProperty,
      handleChangeProperty,
      handleChangePropertyField,
      handleCopyProperty,
      handlePasteProperty,
      handleSortProperties,
      handleUnlockInterface,
      bodyOption,
      handleClickRow,
      itf,
      copyId,
    } = this.props
    const handleValueChange = (
      id, value
    ) =>
      handleChangePropertyField(
        id,
        'value',
        value
      )
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
            <Translation>
              {(t) => {
                const MOCK_RULE = mockRuleGenerator(t)
                const { children } = property
                let list = []
                if (
                  children.length > 0 &&
                                    children[0].scope === 'request'
                ) {
                  list = [
                    ...filter(children, POS_TYPE.HEADER),
                    ...filter(children, POS_TYPE.QUERY),
                    ...filter(children, POS_TYPE.BODY),
                  ]
                } else {
                  list = children.sort(
                    (a, b) => a.priority - b.priority
                  )
                }
                return list.map((item: any) => {
                  const childrenIsExpanding =
                                        this.state.childrenExpandingIdList.includes(
                                          item.id
                                        )
                  return (
                    <div
                      key={item.id}
                      className="SortableTreeTableRow"
                      data-id={item.id}
                      onClick={(e) => {
                        this.handleClickRow(e, item.id)
                      }}
                      onBlur={(e) => {
                        if (highlightId === item.id) {
                          this.handleClickRow(e, '')
                        }
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        this.handleShortKey(e, item)
                      }}
                    >
                      <div
                        className={classNames(
                          'flex-row',
                          {
                            focus:
                                                            editable &&
                                                            item.id ===
                                                                highlightId,
                          }
                        )}
                      >
                        <div className="td operations nowrap">
                          {editable && (
                            <>
                              {copyId && (
                                <Tooltip
                                  title={
                                    t(
                                      'Property paste'
                                    ) +
                                                                        ' (CTRL + V)'
                                  }
                                >
                                  <Link
                                    to=""
                                    onClick={(
                                      e
                                    ) => {
                                      e.preventDefault()
                                      handlePasteProperty(
                                        item.id
                                      )
                                    }}
                                  >
                                    <FaPaste className="fontsize-14 color-6" />
                                  </Link>
                                </Tooltip>
                              )}
                              <Tooltip
                                title={
                                  t(
                                    'Property copy'
                                  ) +
                                                                    ' (CTRL + C)'
                                }
                              >
                                <Link
                                  to=""
                                  onClick={(
                                    e
                                  ) => {
                                    e.preventDefault()
                                    handleCopyProperty(
                                      item.id
                                    )
                                  }}
                                >
                                  <AiOutlineCopy className="fontsize-14 color-6" />
                                </Link>
                              </Tooltip>
                              <Tooltip
                                title={
                                  t(
                                    'Property delete'
                                  ) +
                                                                    ' (CTRL + D)'
                                }
                              >
                                <Link
                                  to=""
                                  onClick={(
                                    e
                                  ) =>
                                    handleDeleteMemoryProperty(
                                      e,
                                      item
                                    )
                                  }
                                >
                                  <GoTrashcan className="fontsize-14 color-6" />
                                </Link>
                              </Tooltip>
                            </>
                          )}
                          {(item.type === 'Object' ||
                                                        item.type ===
                                                            'Array') &&
                                                    item.children &&
                                                    item.children.length ? (
                              <Link
                                to=""
                                onClick={(e) => {
                                  e.preventDefault()
                                  this.setState(
                                    (prev) => ({
                                      ...prev,
                                      childrenExpandingIdList:
                                                                            childrenIsExpanding
                                                                              ? prev.childrenExpandingIdList.filter(
                                                                                (
                                                                                  id
                                                                                ) =>
                                                                                  id !==
                                                                                          item.id
                                                                              )
                                                                              : [
                                                                                ...prev.childrenExpandingIdList,
                                                                                item.id,
                                                                              ],
                                    })
                                  )
                                }}
                              >
                                {childrenIsExpanding ? (
                                  <GoChevronDown className="fontsize-14 color-6 freq" />
                                ) : (
                                  <GoChevronRight className="fontsize-14 color-6 freq" />
                                )}
                              </Link>
                            ) : null}
                          {editable && (
                            <>
                              {item.type ===
                                                                'Object' ||
                                                            item.type ===
                                                                'Array' ? (
                                  <Link
                                    to=""
                                    onClick={(
                                      e
                                    ) => {
                                      e.preventDefault()
                                      handleClickCreateChildPropertyButton(
                                        item
                                      )
                                      this.setState(
                                        (
                                          prev
                                        ) => ({
                                          ...prev,
                                          childrenExpandingIdList:
                                                                                    _.uniq(
                                                                                      [
                                                                                        ...prev.childrenExpandingIdList,
                                                                                        item.id,
                                                                                      ]
                                                                                    ),
                                        })
                                      )
                                    }}
                                  >
                                    <GoPlus className="fontsize-14 color-6 freq" />
                                  </Link>
                                ) : null}
                            </>
                          )}
                        </div>
                        <div
                          className={`td payload name depth-${item.depth}`}
                        >
                          {!editable ? (
                            <>
                              <CopyToClipboard
                                text={item.name}
                                type="right"
                              >
                                <span className="name-wrapper">
                                  {item.pos ===
                                                                        POS_TYPE.BODY &&
                                                                    item.scope ===
                                                                        'request' ? (
                                      <Tooltip
                                        title={formatBodyOption(
                                          bodyOption ??
                                                                                    BODY_OPTION.RAW
                                        )}
                                      >
                                        <span>
                                          {
                                            item.name
                                          }
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      item.name
                                    )}
                                </span>
                              </CopyToClipboard>
                              {item.scope ===
                                                                'request' &&
                                                            item.depth === 0 ? (
                                  <div
                                    style={{
                                      margin: '1px 0 0 3px',
                                    }}
                                  >
                                    <PropertyLabel
                                      pos={
                                        item.pos
                                      }
                                      itf={
                                        itf
                                      }
                                    />
                                  </div>
                                ) : null}
                            </>
                          ) : (
                            <input
                              ref={(
                                input: HTMLInputElement
                              ) => {
                                if (
                                  item.id ===
                                                                    highlightId
                                ) {
                                  this.focusNameInput =
                                                                        input
                                }
                              }}
                              value={item.name}
                              onChange={(e) => {
                                handleChangePropertyField(
                                  item.id,
                                  'name',
                                  e.target
                                    .value
                                )
                              }}
                              onKeyPress={(e) => {
                                if (
                                  e.ctrlKey ===
                                                                        true &&
                                                                    e.charCode ===
                                                                        13
                                ) {
                                  // auto fill by name
                                  // TODO:
                                }
                              }}
                              className="form-control editable ignore"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                        </div>
                        <Translation>
                          {(t) => (
                            <div
                              className={`td payload required type depth-${item.depth} nowrap`}
                            >
                              <Checkbox
                                checked={
                                  !!item.required
                                }
                                disabled={
                                  !editable
                                }
                                onChange={(e) =>
                                  handleChangePropertyField(
                                    item.id,
                                    'required',
                                    e.target
                                      .checked
                                  )
                                }
                                color="primary"
                                inputProps={{
                                  'aria-label':
                                                                        t(
                                                                          'Required'
                                                                        ),
                                }}
                              />
                            </div>
                          )}
                        </Translation>

                        <div className="td payload type">
                          {!editable ? (
                            <CopyToClipboard
                              text={item.type}
                            >
                              <span className="nowrap">
                                {item.type}
                              </span>
                            </CopyToClipboard>
                          ) : (
                            <select
                              value={item.type}
                              onChange={(e) => {
                                const type =
                                                                    e.target
                                                                      .value
                                if (
                                  isNoValueType(
                                    type
                                  )
                                ) {
                                  handleChangeProperty(
                                    item.id,
                                    {
                                      value: '',
                                      type,
                                    }
                                  )
                                } else {
                                  handleChangeProperty(
                                    item.id,
                                    { type }
                                  )
                                }
                              }}
                              className="form-control editable"
                            >
                              {TYPES.map(
                                (type) => (
                                  <option
                                    key={
                                      type
                                    }
                                    value={
                                      type
                                    }
                                  >
                                    {type}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        </div>
                        <div className="td payload rule nowrap">
                          {!editable ? (
                            <span className="nowrap">
                              {item.rule}
                            </span>
                          ) : (
                            <input
                              value={
                                item.rule || ''
                              }
                              onChange={(e) =>
                                handleChangePropertyField(
                                  item.id,
                                  'rule',
                                  e.target
                                    .value
                                )
                              }
                              className="form-control editable ignore"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                        </div>
                        <div className="td payload value">
                          {!editable ? (
                            <CopyToClipboard
                              text={item.value}
                            >
                              <span className="value-container">
                                {getFormattedValue(
                                  item
                                )}
                              </span>
                            </CopyToClipboard>
                          ) : (
                            <PropertyModalContext.Consumer>
                              {({toggleModal}) => (
                                <Autocomplete
                                  freeSolo={true}
                                  fullWidth={true}
                                  value={
                                    item.value ?? ''
                                  }
                                  disabled={
                                    isNoValueType(
                                      item.type
                                    ) && !item.value
                                  }
                                  onChange={(_, value) => {handleValueChange(item.id, value)}}
                                  onInputChange={(_, value) => {handleValueChange(item.id, value)}}
                                  options={Object.keys(MOCK_RULE)}
                                  clearIcon={<CgExpand onClick={(e) => {
                                    e.stopPropagation()
                                    toggleModal({
                                      open: true,
                                      initialValues: item.value,
                                      title: t('Initial value'),
                                      placeholder: t('Please input the initial value'),
                                      onClose: () => {
                                        toggleModal({
                                          open: false,
                                        })
                                      },
                                      onConfirm: (v) => {
                                        handleValueChange(item.id, v)
                                      },
                                    })
                                  }}/>}
                                  PopperComponent={
                                    (props) => <Popper {...props} style={{ width: 500 }} />
                                  }
                                  renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                                  renderOption={
                                    (props, option) => (
                                      <li {...props}>
                                        <Box>
                                          <span>{option}</span>
                                          <span style={{position: 'absolute', right: 14}}>{MOCK_RULE[option]}</span>
                                        </Box>
                                      </li>
                                    )
                                  }
                                />
                              )}
                            </PropertyModalContext.Consumer>
                          )}
                        </div>
                        <div className="td payload desc">
                          {!editable ? (
                            <CopyToClipboard
                              text={
                                item.description
                              }
                            >
                              <span>
                                {
                                  item.description
                                }
                              </span>
                            </CopyToClipboard>
                          ) : (
                            <div className="descEditor" style={{}}>
                              <CssTextField
                                style={{width: '100%', paddingRight: '39px'}}
                                value={
                                  item.description || ''
                                }
                                onChange={(
                                  e: any
                                ) =>
                                  handleChangePropertyField(
                                    item.id,
                                    'description',
                                    e.target
                                      .value
                                  )
                                }
                                variant="outlined" />
                              <PropertyModalContext.Consumer>
                                {({toggleModal}) => (
                                  <IconButton size="medium" className="descEditorBtn" onClick={(e) => {
                                    toggleModal({
                                      open: true,
                                      initialValues: item.description,
                                      title: t('Introduction'),
                                      placeholder: t('Introduction'),
                                      onClose: () => {
                                        toggleModal({
                                          open: false,
                                        })
                                      },
                                      onConfirm: (v) => {
                                        handleChangePropertyField(
                                          item.id,
                                          'description',
                                          v
                                        )
                                      },
                                    })
                                  }}><CgExpand /></IconButton>
                                )}
                              </PropertyModalContext.Consumer>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.children &&
                                            item.children.length ? (
                          <SortableTreeTableRow
                            editable={editable}
                            highlightId={highlightId}
                            interfaceId={interfaceId}
                            handleClickCreateChildPropertyButton={
                              handleClickCreateChildPropertyButton
                            }
                            handleClickRow={
                              handleClickRow
                            }
                            handleDeleteMemoryProperty={
                              handleDeleteMemoryProperty
                            }
                            handleChangeProperty={
                              handleChangeProperty
                            }
                            handleChangePropertyField={
                              handleChangePropertyField
                            }
                            handleCopyProperty={
                              handleCopyProperty
                            }
                            handlePasteProperty={
                              handlePasteProperty
                            }
                            handleSortProperties={
                              handleSortProperties
                            }
                            handleUnlockInterface={
                              handleUnlockInterface
                            }
                            property={item}
                            bodyOption={bodyOption}
                            isExpanding={
                              childrenIsExpanding
                            }
                            itf={itf}
                            copyId={copyId}
                          />
                        ) : null}
                    </div>
                  )
                })
              }}
            </Translation>
          </div>
        </RSortable>
      )
    )
  }
}

const SortableTreeTableRow = connect(
  (state: RootState) => ({ copyId: state.copyId }),
  {}
)(SortableTreeTableRowWrapped)

class SortableTreeTable extends Component<any, any> {
  render() {
    const {
      root,
      editable,
      highlightId,
      interfaceId,
      handleClickCreateChildPropertyButton,
      handleClickRow,
      handleDeleteMemoryProperty,
      handleChangeProperty,
      handleChangePropertyField,
      handleCopyProperty,
      handlePasteProperty,
      handleSortProperties,
      handleUnlockInterface,
      bodyOption,
      itf,
      copyId,
    } = this.props
    return (
      <div className={`SortableTreeTable ${editable ? 'editable' : ''}`}>
        <SortableTreeTableHeader {...this.props} />
        <SortableTreeTableRow
          editable={editable}
          highlightId={highlightId}
          handleClickCreateChildPropertyButton={
            handleClickCreateChildPropertyButton
          }
          handleClickRow={handleClickRow}
          handleDeleteMemoryProperty={handleDeleteMemoryProperty}
          handleChangeProperty={handleChangeProperty}
          handleChangePropertyField={handleChangePropertyField}
          handleCopyProperty={handleCopyProperty}
          handlePasteProperty={handlePasteProperty}
          handleSortProperties={handleSortProperties}
          handleUnlockInterface={handleUnlockInterface}
          interfaceId={interfaceId}
          property={root}
          isExpanding={true}
          bodyOption={bodyOption}
          itf={itf}
          copyId={copyId}
        />
      </div>
    )
  }
}

class PropertyList extends PureComponent<any, any> {
  static contextTypes = {
    handleAddMemoryProperty: PropTypes.func.isRequired,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      highlightId: undefined,
      createProperty: false,
      createChildProperty: false,
      previewer: props.scope === 'response',
      importer: false,
    }
  }
  async componentDidMount(): Promise<void> {
    const S_SAVE_KEY = `Previewer-${this.props.scope}-${this.props?.itf?.id}`
    const data = await DefaultStorage.get(S_SAVE_KEY)

    if (_.isBoolean(data)) {
      this.setState({ previewer: data })
    }
  }
  render() {
    const {
      title,
      label,
      scope,
      properties = [],
      repository = {},
      mod = {},
      interfaceId,
      bodyOption,
      posFilter,
      itf,
    } = this.props
    if (!interfaceId) {
      return null
    }
    const { editable } = this.props // itf.locker && (itf.locker.id === auth.id)
    let scopedProperties = properties
      .map((property: any) => ({ ...property }))
      .filter((property: any) => property.scope === scope)
    if (scope === 'request' && editable) {
      scopedProperties = scopedProperties.filter(
        (s: any) => s.pos === posFilter
      )
    }

    return (
      <section className="PropertyList">
        <div className="header clearfix">
          <span className="title">{title || `${label}属性`}</span>
          <div className="toolbar">
            <Translation>
              {(t) => (
                <ButtonGroup size="small" color="primary">
                  {editable && [
                    <Button
                      key={1}
                      onClick={
                        this
                          .handleClickCreatePropertyButton
                      }
                    >
                      {t('Create')}
                    </Button>,
                    <Button
                      key={2}
                      onClick={() => {
                        this.handleChangeAllProperty()
                      }}
                    >
                      {t('empty')}
                    </Button>,
                    <Button
                      key={3}
                      onClick={
                        this.handleClickImporterButton
                      }
                    >
                      {t('Import')}
                    </Button>,
                  ]}
                  <Button
                    className={
                      this.state.previewer
                        ? 'checked-button'
                        : ''
                    }
                    onClick={
                      this.handleClickPreviewerButton
                    }
                  >
                    {t('Preview')}
                  </Button>
                </ButtonGroup>
              )}
            </Translation>
          </div>
        </div>
        <div className="body">
          <SortableTreeTable
            root={Tree.arrayToTree(scopedProperties)}
            isCheckAll={
              scopedProperties.length > 0 &&
                            !scopedProperties.some(
                              (item) => !!item.required === false
                            )
            }
            bodyOption={bodyOption}
            editable={editable}
            highlightId={this.state.highlightId}
            interfaceId={interfaceId}
            handleClickCreateChildPropertyButton={
              this.handleClickCreateChildPropertyButton
            }
            handleClickRow={this.handleClickRow}
            handleDeleteMemoryProperty={
              this.handleDeleteMemoryProperty
            }
            handleChangePropertyField={
              this.handleChangePropertyField
            }
            handleChangeAllOption={this.handleChangeAllOption}
            handleChangeProperty={this.handleChangeProperty}
            handleChangeAllProperty={this.handleChangeAllProperty}
            handleCopyProperty={this.handleCopyProperty}
            handlePasteProperty={this.handlePasteProperty}
            handleSortProperties={this.handleSortProperties}
            handleClickCreatePropertyButton={
              this.handleClickCreatePropertyButton
            }
            handleUnlockInterface={this.props.handleUnlockInterface}
            itf={itf}
          />
        </div>
        <div className="footer">
          {this.state.previewer && (
            <Previewer
              scope={scope}
              label={label}
              properties={properties}
              interfaceId={interfaceId}
            />
          )}
        </div>
        <RModal
          when={this.state.createProperty}
          onClose={() => this.setState({ createProperty: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <Translation>
            {(t) => (
              <PropertyForm
                title={`${t('Create')}${label}${t(
                  'attribute'
                )}`}
                scope={scope}
                repository={repository}
                mod={mod}
                interfaceId={interfaceId}
              />
            )}
          </Translation>
        </RModal>
        <RModal
          when={!!this.state.createChildProperty}
          onClose={() =>
            this.setState({ createChildProperty: false })
          }
          onResolve={this.handleCreatePropertySucceeded}
        >
          <Translation>
            {(t) => (
              <PropertyForm
                title={`${t('Create')}${label}${t(
                  'attribute'
                )}`}
                scope={scope}
                repository={repository}
                mod={mod}
                interfaceId={interfaceId}
                parent={this.state.createChildProperty}
              />
            )}
          </Translation>
        </RModal>
        <RModal
          when={this.state.importer}
          onClose={() => this.setState({ importer: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <Translation>
            {(t) => (
              <Importer
                title={`${t('Import')} [ ${label} ] ${t(
                  'attribute'
                )}`}
                repository={repository}
                mod={mod}
                interfaceId={interfaceId}
                scope={scope}
                pos={posFilter}
              />
            )}
          </Translation>
        </RModal>
      </section>
    )
  }
  handleCopyProperty = (id: string) => {
    this.props.handleCopyProperty(id)
  }
  handlePasteProperty = (newId: string) => {
    const { scope, handleChangeAllProperty, copyId } = this.props
    const properties = [...this.props.properties].sort(
      (a: Property, b: Property) => a.priority - b.priority
    )
    const index = properties.findIndex((item) => item.id === copyId)
    const pressIndex = properties.findIndex((item) => item.id === newId)
    if (copyId !== '' && index > -1) {
      const pressItem = properties[pressIndex]
      const id = _.uniqueId('memory-')
      const newItem = _.clone(properties[index])
      newItem.id = id
      newItem.scope = scope
      newItem.priority =
                Math.max(pressItem.priority || 0, pressIndex) + 1
      newItem.parentId = pressItem.parentId || -1
      newItem.pos = pressItem.pos
      newItem.memory = true
      const children = []
      const handleChildren = (parentId, newParentId) => {
        properties
          .filter((item) => item.parentId === parentId)
          .map((item) => {
            const el = _.clone(item)
            const nid = _.uniqueId('memory-')
            handleChildren(el.id, nid)
            el.parentId = newParentId
            el.id = nid
            el.scope = scope
            el.pos = pressItem.pos
            el.memory = true
            children.push(el)
            return el
          })
      }
      handleChildren(copyId, id)
      properties.splice(pressIndex + 1, 0, newItem, ...children)
      handleChangeAllProperty(properties)
      this.setState({ highlightId: id })
    }
  }
  handleClickCreatePropertyButton = () => {
    this.handleClickCreateChildPropertyButton()
  }
  handleClickCreateChildPropertyButton = (
    parent: Partial<Property> = { id: -1 }
  ) => {
    const { handleAddMemoryProperty } = this.context as any
    const {
      auth,
      scope,
      repository = {},
      mod = {},
      interfaceId,
    } = this.props
    const childId = _.uniqueId('memory-')
    const child = {
      ...mockProperty(),
      id: childId,
      creatorId: auth.id,
      repositoryId: repository.id,
      moduleId: mod.id,
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
  handleClickRow = (id: string) => {
    this.setState({ highlightId: id })
  }
  handleClickImporterButton = () => {
    this.setState({ importer: true })
  }
  handleClickPreviewerButton = () => {
    this.setState({ previewer: !this.state.previewer })

    const S_SAVE_KEY = `Previewer-${this.props.scope}-${this.props?.itf?.id}`
    DefaultStorage.set(
      S_SAVE_KEY,
      !this.state.previewer,
      ExpireTimeEnum.oneMonth
    )
  }
  handleChangePropertyField = (id: number, key: any, value: any) => {
    const { handleChangeProperty } = this.props
    const { properties, enqueueSnackbar } = this.props
    const property = properties.find((property: any) => property.id === id)
    if (
      key === 'rule' &&
            property.type === 'String' &&
            parseInt(value, 10) > MAX_STRING_RULE
    ) {
      enqueueSnackbar(i18n['t']('RuleTip') + MAX_STRING_RULE, {
        variant: 'error',
      })
      return
    }
    handleChangeProperty({ ...property, [key]: value })
  }
  handleChangeProperty = (id: number, value: any) => {
    const { handleChangeProperty } = this.props
    const { properties, enqueueSnackbar } = this.props
    const property = properties.find((property: any) => property.id === id)
    if (
      value.type === 'String' &&
            property.rule &&
            property.rule
              .match(/(\d+)/g)
              .some((p) => parseInt(p, 10) > MAX_STRING_RULE)
    ) {
      enqueueSnackbar(i18n['t']('RuleTip') + MAX_STRING_RULE, {
        variant: 'error',
      })
      return
    }
    handleChangeProperty({ ...property, ...value })
  }
  handleChangeAllProperty = (key?: string, value?: any) => {
    const { handleChangeAllProperty, scope, properties } = this.props
    if (properties.length > 0) {
      if (!key) {
        handleChangeAllProperty(
          properties.filter((p) => p.scope !== scope)
        )
      } else {
        handleChangeAllProperty(
          properties.map((p) => {
            if (p.scope === scope) {
              p[key] = value
            }
            return p
          })
        )
      }
    }
  }
  handleChangeAllOption = () => {
    const { handleChangeAllProperty, scope, properties, posFilter } = this.props
    if (scope === 'request') {
      handleChangeAllProperty(
        properties.filter(p => p.scope !== scope || (p.scope === scope && p.pos !== posFilter))
      )
    } else {
      this.handleChangeAllProperty()
    }
  }
  handleCreatePropertySucceeded = () => {
    /** empty */
  }
  handleDeleteMemoryProperty = (e: any, property: any) => {
    e.preventDefault()
    const { handleDeleteMemoryProperty } = this.props
    handleDeleteMemoryProperty(property)
  }
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

export default connect(
  (state: RootState) => ({ copyId: state.copyId }),
  {}
)(withSnackbar(PropertyList))
