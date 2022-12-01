import {
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material'
import { Interface, Repository } from 'actions/types'
import copy from 'clipboard-copy'
import Markdown from 'markdown-to-jsx'
import { Component } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { Translation } from 'react-i18next'
import { GoAlert } from 'react-icons/go'
import { connect } from 'react-redux'
import { PropTypes, replace } from '../../family'
import { serve } from '../../relatives/services/constant'
import { getRelativeBathPath, getRelativeUrl } from '../../utils/URLUtils'
import { CopyToClipboard, TagView } from '../utils/'
import { METHODS, STATUS_LIST } from './InterfaceForm'
import './InterfaceSummary.sass'
import InterfaceTagSelect from './InterfaceTagSelect'

export enum BODY_OPTION {
  FORM_DATA = 'FORM_DATA',
  FORM_URLENCODED = 'FORM_URLENCODED',
  RAW = 'RAW',
  BINARY = 'BINARY',
}

export const getBodyOptionStr = (bo: string) => {
  if (bo === BODY_OPTION.FORM_URLENCODED) {
    return 'x-www-form-urlencoded'
  } else if (bo === BODY_OPTION.FORM_DATA) {
    return 'form-data'
  } else if (bo === BODY_OPTION.RAW) {
    return 'raw'
  } else if (bo === BODY_OPTION.BINARY) {
    return 'binary'
  } else {
    return '-'
  }
}

export function formatBodyOption(type: BODY_OPTION) {
  switch (type) {
    case BODY_OPTION.BINARY:
      return 'Binary'
    case BODY_OPTION.FORM_DATA:
      return 'FormData'
    case BODY_OPTION.FORM_URLENCODED:
      return 'UrlEncoded'
    case BODY_OPTION.RAW:
      return 'Raw'
    default:
      return '-'
  }
}

export const BODY_OPTION_LIST = [
  { label: 'form-data', value: BODY_OPTION.FORM_DATA },
  { label: 'x-www-form-urlencoded', value: BODY_OPTION.FORM_URLENCODED },
  { label: 'raw', value: BODY_OPTION.RAW },
  { label: 'binary', value: BODY_OPTION.BINARY },
]

/**
 * 参数类型
 */
export enum POS_TYPE {
  QUERY = 2,
  HEADER = 1,
  BODY = 3,
  PRE_REQUEST_SCRIPT = 4,
  TEST = 5,
}

function getVersionUrl(version, url) {
  let str = url
  if (version && version?.id && !version?.isMaster) {
    str += `${url.includes('?') ? '&' : '?'}__ver=${version.id}`
  }
  return str
}
function url2name(itf: any) {
  // copy from http://gitlab.alibaba-inc.com/thx/magix-cli/blob/master/platform/rap.js#L306
  const method = itf.method.toLowerCase()
  const apiUrl = itf.url
  const projectId = itf.repositoryId
  const id = itf.id
  // eslint-disable-next-line
  const regExp = /^(?:https?:\/\/[^\/]+)?(\/?.+?\/?)(?:\.[^./]+)?$/
  const regExpExec = regExp.exec(apiUrl)

  if (!regExpExec) {
    return {
      ok: false,
      name: '',
      message: `\n  ✘ 您的rap接口url设置格式不正确，参考格式：/api/test.json (接口url:${apiUrl}, 项目id:${projectId}, 接口id:${id})\n`,
    }
  }

  const urlSplit = regExpExec[1].split('/')

  // 接口地址为RESTful的，清除占位符
  // api/:id/get -> api//get
  // api/bid[0-9]{4}/get -> api//get
  urlSplit.forEach((item, i) => {
    // eslint-disable-next-line
    if (/\:id/.test(item)) {
      urlSplit[i] = '$id'
      // eslint-disable-next-line
    } else if (/[\[\]\{\}]/.test(item)) {
      urlSplit[i] = '$regx'
    }
  })

  // 只去除第一个为空的值，最后一个为空保留
  // 有可能情况是接口 /api/login 以及 /api/login/ 需要同时存在
  if (urlSplit[0].trim() === '') {
    urlSplit.shift()
  }

  urlSplit.push(method)

  const urlToName = urlSplit.join('_')
  return {
    ok: true,
    name: urlToName,
    message: '',
  }
}
type InterfaceSummaryProps = {
  store: any
  handleChangeInterface: (itf: Partial<Interface>) => void
  [x: string]: any
}
type InterfaceSummaryState = {
  bodyOption?: any
  method?: any
  status?: any
  posFilter: POS_TYPE
  [x: string]: any
}
class InterfaceSummary extends Component<InterfaceSummaryProps, InterfaceSummaryState> {
  static contextTypes = {
    onDeleteInterface: PropTypes.func.isRequired,
  }
  constructor(props: InterfaceSummaryProps) {
    super(props)
    this.state = {
      bodyOption: props?.itf?.bodyOption ?? BODY_OPTION.FORM_DATA,
      posFilter: props?.itf?.method === 'POST' ? POS_TYPE.BODY : POS_TYPE.QUERY,
    }
    this.changeMethod = this.changeMethod.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.switchBodyOption = this.switchBodyOption.bind(this)
    this.switchPos = this.switchPos.bind(this)
    this.copyModelName = this.copyModelName.bind(this)
    props.stateChangeHandler && props.stateChangeHandler(this.state)
  }
  switchBodyOption(val: BODY_OPTION) {
    this.setState({ bodyOption: val }, () => {
      this.props.stateChangeHandler(this.state)
    })
  }
  switchPos(val: POS_TYPE) {
    return () => {
      this.setState({ posFilter: val }, () => {
        this.props.stateChangeHandler(this.state)
      })
    }
  }
  changeMethod(method: any) {
    this.setState({ method })
  }
  changeStatus(status: any) {
    this.setState({ status })
  }
  changeHandler(e: any) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }
  copyModelName() {
    const { itf = {} } = this.props
    const res = url2name(itf)
    if (!res.ok) {
      this.props.enqueueSnackbar(`复制失败: ${res.message}`, {
        variant: 'warning',
      })
      return
    }
    const modelName = res.name
    copy(modelName)
      .then(() => {
        this.props.enqueueSnackbar(`成功复制 ${modelName} 到剪贴板`, {
          variant: 'warning',
        })
      })
      .catch(() => {
        this.props.enqueueSnackbar(`复制失败`, { variant: 'warning' })
      })
  }
  render() {
    const {
      repository = {} as Repository,
      itf = {} as Interface,
      editable,
      handleChangeInterface,
    } = this.props
    const { posFilter } = this.state
    const keyMap = {
      COPY_MODEL_NAME: ['ctrl+alt+c'],
    }

    const handlers = {
      COPY_MODEL_NAME: this.copyModelName,
    }

    if (!itf.id) {
      return null
    }
    const methodError =
      ['GET', 'DELETE'].includes(itf.method) &&
      itf.properties?.some((x) => x.scope === 'request' && x.pos === 3)

    const tagIds = itf.tagIds || itf.tags?.map?.((tag) => tag.id) || []
    const itfUrl = `${serve}/app/mock/${
      repository.id
    }/${itf.method.toLowerCase()}${getRelativeBathPath(repository.basePath)}${getVersionUrl(
      repository.version,
      getRelativeUrl(itf.url)
    )}`
    return (
      <Translation>
        {(t) => (
          <div className="InterfaceSummary">
            <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
            {!editable && (
              <div className="header">
                <CopyToClipboard text={itf.name}>
                  <span className="title">{itf.name}</span>
                </CopyToClipboard>
              </div>
            )}
            <ul className="summary">
              {editable ? (
                <div style={{ maxWidth: 600 }}>
                  <div>
                    <TextField
                      style={{ marginTop: 0 }}
                      id="name"
                      label={t('Name')}
                      value={itf.name || ''}
                      fullWidth={true}
                      autoComplete="off"
                      onChange={(e) => {
                        handleChangeInterface({
                          name: e.target.value,
                        })
                      }}
                      margin="normal"
                    />
                  </div>
                  <div>
                    <TextField
                      id="url"
                      label={t('URL')}
                      value={itf.url || ''}
                      fullWidth={true}
                      autoComplete="off"
                      onChange={(e) => {
                        handleChangeInterface({
                          url: e.target.value,
                        })
                      }}
                      margin="normal"
                    />
                  </div>
                  <Stack className="mt2" direction="row" spacing={2}>
                    <div style={{ width: 80 }}>
                      <InputLabel shrink={true} htmlFor="method-label-placeholder">
                        {' '}
                        {t('Method')}{' '}
                      </InputLabel>
                      <Select
                        value={itf.method}
                        input={<Input name="method" id="method-label-placeholder" />}
                        onChange={(e) => {
                          handleChangeInterface({
                            method: e.target.value as any as string,
                          })
                        }}
                        displayEmpty={true}
                        name="method"
                      >
                        {METHODS.map((method) => (
                          <MenuItem key={method} value={method}>
                            {method}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div style={{ width: 80 }}>
                      <InputLabel
                        shrink={true}
                        htmlFor="status-label-placeholder"
                        style={{ width: 100 }}
                      >
                        {' '}
                        {t('Status code')}{' '}
                      </InputLabel>
                      <Select
                        value={itf.status}
                        input={<Input name="status" id="status-label-placeholder" />}
                        onChange={(e) => {
                          handleChangeInterface({
                            status: e.target.value as any as number,
                          })
                        }}
                        displayEmpty={true}
                        name="status"
                      >
                        {STATUS_LIST.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div style={{ width: 80 }}>
                      <Tooltip title={t('Is tmpl desc')} placement="right">
                        <div>
                          <InputLabel shrink={true} style={{ width: 100 }}>
                            {' '}
                            {t('Is tmpl')}{' '}
                          </InputLabel>
                          <Switch
                            checked={itf.isTmpl}
                            onChange={(e) => {
                              handleChangeInterface({
                                isTmpl: e.target.checked,
                              })
                            }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </Stack>
                  <div style={{ margin: '10px 0' }}>
                    <InterfaceTagSelect
                      canUserEdit={repository?.canUserEdit}
                      title={t('Add')}
                      repositoryId={itf?.repositoryId}
                      tagIds={tagIds}
                      onChange={(tagIds) => {
                        handleChangeInterface({ tagIds })
                      }}
                    />
                  </div>
                  <TextField
                    id="description"
                    label={t('Description (multiple lines, supporting the Markdown)')}
                    value={itf.description || ''}
                    fullWidth={true}
                    multiline={true}
                    autoComplete="off"
                    maxRows={8}
                    onChange={(e) => {
                      handleChangeInterface({
                        description: e.target.value,
                      })
                    }}
                    margin="normal"
                  />
                </div>
              ) : (
                <>
                  <li>
                    <span className="mr5">
                      <span className="label">{t('API')} ID：</span>
                      {itf.id}
                    </span>
                  </li>
                  <li>
                    <span>
                      <span className="label">{t('URL')}: </span>
                      <a href={itfUrl} target="_blank" rel="noopener noreferrer">
                        {itf.url}
                      </a>
                      <span className="ml8 scene-icon">
                        <CopyToClipboard
                          text={itf.url}
                          type="right"
                          label={`${t('copy')} URL`}
                          tip={t('copy') + ' URL'}
                        >
                          <span></span>
                        </CopyToClipboard>
                      </span>
                      <span className="ml8 scene-icon">
                        <CopyToClipboard
                          text={`${itf.method.toUpperCase()}${itf.url}`}
                          type="right"
                          label={`${t('copy')} Rapper Key`}
                          tip={t('copy') + ' Mock Path'}
                        >
                          <span></span>
                        </CopyToClipboard>
                      </span>
                    </span>
                  </li>
                  <li>
                    <span>
                      <span className="label">{t('Method')}: </span>
                      <span>{itf.method}</span>
                      {methodError && (
                        <span className="warning">
                          <GoAlert
                            className="icon"
                            style={{
                              marginTop: '-2px',
                              marginLeft: '5px',
                            }}
                          />
                          <span>{t('methodErrorTip')}</span>
                        </span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span>
                      <span className="label">{t('Status code')}: </span>
                      <span>{itf.status}</span>
                    </span>
                  </li>
                  <li>
                    <span>
                      <span className="label">{t('Is tmpl or not')}: </span>
                      <span>{t(itf.isTmpl ? 'Yes' : 'No')}</span>
                    </span>
                  </li>
                </>
              )}
            </ul>

            {!editable && itf?.tags?.length ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="label" style={{ marginRight: '5px' }}>
                  {t('Tags')}:
                </span>
                <TagView tags={itf?.tags} style={{ marginBottom: '5px' }} />
              </div>
            ) : null}

            {itf.description && (
              <CopyToClipboard text={itf.description}>
                <Markdown>{itf.description || ''}</Markdown>
              </CopyToClipboard>
            )}
            {editable && (
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" onClick={this.switchPos(POS_TYPE.HEADER)}>
                  <button
                    className={`nav-link ${posFilter === POS_TYPE.HEADER ? 'active' : ''}`}
                    role="tab"
                    data-toggle="tab"
                  >
                    Headers
                  </button>
                </li>
                <li className="nav-item" onClick={this.switchPos(POS_TYPE.QUERY)}>
                  <button
                    className={`nav-link ${posFilter === POS_TYPE.QUERY ? 'active' : ''}`}
                    role="tab"
                    data-toggle="tab"
                  >
                    Query Params
                  </button>
                </li>
                <li className="nav-item" onClick={this.switchPos(POS_TYPE.BODY)}>
                  <button
                    className={`nav-link ${posFilter === POS_TYPE.BODY ? 'active' : ''}`}
                    role="tab"
                    data-toggle="tab"
                  >
                    Body Params
                  </button>
                </li>
              </ul>
            )}
            {editable && posFilter === POS_TYPE.BODY ? (
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="body type"
                  name="body-type"
                  value={this.state.bodyOption}
                  onChange={(e) => this.switchBodyOption(e.target.value as BODY_OPTION)}
                  row={true}
                >
                  {BODY_OPTION_LIST.map((x) => (
                    <FormControlLabel
                      key={x.value}
                      value={x.value}
                      control={<Radio />}
                      label={x.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ) : null}
          </div>
        )}
      </Translation>
    )
  }
  handleDelete = () => {
    /** empty */
  }
  handleUpdate = () => {
    /** empty */
  }
}
const mapStateToProps = () => ({})
const mapDispatchToProps = {
  replace,
}
export default connect(mapStateToProps, mapDispatchToProps)(InterfaceSummary)
