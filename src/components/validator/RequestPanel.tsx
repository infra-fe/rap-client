import { Button, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { Form, Formik } from 'formik'
import { cloneDeep, uniqueId } from 'lodash'
import { useSnackbar } from 'notistack'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mergeObject, mergeObjectListBy } from 'utils/DataUtils'
import { BaseServerStorage, ExpireTimeEnum, GlobalHeadersStorage, RequestParamsStorage, TargetResponseStorage } from 'utils/Storage'
import { METHODS } from '../editor/InterfaceForm'
import { BODY_OPTION_LIST } from '../editor/InterfaceSummary'
import JSONEditor from '../JSONEditor/JSONEditor'
import { IJSONEditorInstance, IJSONEditorOptions, IValidateError } from '../JSONEditor/JSONEditorTypes'
import { createJSONData, createJSONSchema, filterProperties, getJSONData, mergeValidateErrors, mockPropertiesValue, updatePropertiesOfID } from '../JSONEditor/JSONEditorUtils'
import ParamsEditor from '../ParamsEditor/ParamsEditor'
import PanelTitle from './PanelTitle'
import { getDefaultServer, invoke } from './RequestUtils'
import { CommonProps, FreePropertyType, ICheckSavedResult, IRequestBaseData, IRequestParamsData, RequestParamsProps, ResponseValidatorProps } from './types'

export function RequestPanel(props: CommonProps, ref: any) {
  const { repository, itf, importData } = props
  const $resultArea = useRef(null)
  const $RequestParams = useRef(null)
  const { t } = useTranslation()
  // const dispatch = useDispatch()


  // ================ 锁定状态控制 ================
  // const [isLocked, setIsLocked] = useState(true)
  // const handleLock = () => {
  //   setIsLocked(!isLocked)
  // }
  // ================ //锁定状态控制 ================

  // ================ 提示状态控制 ================
  // const duration = 6000
  // const [showTips, setShowTips] = useState(false)
  // const [errorMsg, setErrorMsg] = useState(null)
  // const [timer, setTimer] = useState(null)
  // const handleCloseTips = () => {
  //   setShowTips(!showTips)
  // }
  // ================ 提示状态控制 ================

  // ================ 接口请求与设置响应结果 ================
  const [responseData, setResponseData] = useState(null)

  const [baseServer, setBaseServer] = useState(
    getDefaultServer({ repositoryId: repository.id, requestMethod: itf.method })
  )
  const [globalHeaders, setGlobalHeaders] = useState(null)

  const { enqueueSnackbar } = useSnackbar()

  // const S_SERVER_KEY = `P${repository.id}-BaseServerSetting` // 服务基本信息
  const S_SERVER_KEY = `P${repository.id}` // 服务基本信息
  // const S_GLOBAL_KEY = `P${repository.id}-GlobalHeadersSetting` // 全局头信息
  const S_GLOBAL_KEY = `P${repository.id}` // 全局头信息

  const initData = async () => {
    const { baseServer: importBaseServer, headers: importHeaders, isCover } = importData || {}
    const local_baseServer = await BaseServerStorage.get(S_SERVER_KEY)
    const local_globalHeaders = await GlobalHeadersStorage.get(S_GLOBAL_KEY)

    const baseServer = isCover ? importBaseServer : mergeObject(local_baseServer, importBaseServer)
    const headers = isCover ? importHeaders : mergeObject(getJSONData(local_globalHeaders), importHeaders)

    baseServer && setBaseServer(baseServer)
    headers && setGlobalHeaders(headers)
  }

  useEffect(() => {
    initData()
  }, [importData])

  const handleInvoke = async (requestBase: IRequestBaseData, params: IRequestParamsData, onSuccess?: () => void, onFail?: () => void) => {
    let { headerParams, queryParams, bodyParams } = params

    headerParams = headerParams?.length ? getJSONData(headerParams, true) : null
    queryParams = queryParams?.length ? getJSONData(queryParams, true) : null
    bodyParams = bodyParams?.length ? getJSONData(bodyParams, true) : null

    try {
      const result = await invoke({
        baseServer,
        globalHeaders,
        requestBase,
        headerParams,
        queryParams,
        bodyParams,
      })


      setResponseData(result)
      // setShowTips(false)
      // setErrorMsg(null)

      // 滚动到可视区域
      $resultArea.current?.scrollIntoView()

      onSuccess && onSuccess()
    } catch (err) {

      setResponseData(null)
      enqueueSnackbar(err.message, { variant: 'error' })
      // setErrorMsg(err.message)
      // setShowTips(true)

      // 错误提示添加自动关闭
      /* if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(() => {
        setShowTips(false)
      }, duration)) */

      onFail && onFail()
    }
  }
  // ================ //接口请求与设置响应结果 ================

  // ================ 非受控方法 ================
  const checkSaved: () => ICheckSavedResult = () => {
    return {
      isSaved: true,
    }
  }
  const checkAndAutoSave = () => {
    $RequestParams?.current?.saveData?.()
  }
  useImperativeHandle(ref, () => ({
    checkSaved: checkSaved,
    checkAndAutoSave: checkAndAutoSave,
  }))
  // ================ //非受控方法 ================

  return (
    <div className="requestPanel" style={{ position: 'relative' }}>
      {/* 接口调用结果提醒 */}
      {/* <Collapse in={showTips} style={{ position: 'absolute', top: '-15px', width: '100%' }}>
        <MuiAlert severity='error' style={{ width: '40%', margin: '0px auto' }}
          icon={<Cancel />}
          action={<IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseTips} >
            <CloseIcon fontSize="inherit" />
          </IconButton>}
        >{errorMsg}</MuiAlert>
      </Collapse> */}

      {/* 接口调用 */}
      <PanelTitle text={t('Sending Requests')}
        buttons={[
          // { icon: LockOutlined, hide: !isLocked, props: { title: t('Locked'), onClick: handleLock } },
          // { icon: LockOpenOutlined, hide: isLocked, props: { title: t('Unlocked'), onClick: handleLock } },
        ]} />
      <RequestParamsWrapper ref={$RequestParams}  {...props} isLocked={false} onInvoke={handleInvoke} />

      {/* 结果校验 */}
      <div ref={$resultArea}></div>
      <PanelTitle text={t('Validate Response')} />
      <ResponseValidator {...props} responseData={responseData} />
    </div>
  )
}

const RequestPanelWrapper = forwardRef(RequestPanel)
export default RequestPanelWrapper

const ParamsPanelDefine = {
  headerParams: {
    id: 'headerParams',
    title: 'Header Params',
    scope: 'request',
    posFilter: 1,
  },
  queryParams: {
    id: 'queryParams',
    title: 'Query Params',
    scope: 'request',
    posFilter: 2,
  },
  bodyParams: {
    id: 'bodyParams',
    title: 'Body Params',
    scope: 'request',
    posFilter: 3,
  },
}

const DefaultBaseData = {
  method: 'GET',
  path: '',
  byProxy: false,
  bodyOption: BODY_OPTION_LIST[0].value,
}

function RequestParams(props: RequestParamsProps, ref: any) {
  const { itf, mod, repository, importData, isLocked, onInvoke } = props
  const { t } = useTranslation()

  const [base, setBase] = useState<IRequestBaseData>(null) // {method,bodyOption,path,byProxy}
  const [params, setParams] = useState<IRequestParamsData>(null) // {headerParams:properties,queryParams:properties,bodyParams:properties}

  const S_SAVE_REPO_KEY = `P${repository.id}` // 按照仓库级别保存代理信息
  const S_SAVE_KEY = `P${repository.id}.M${mod.id}.I${itf.id}` // 按照接口级别保存接口请求信息


  // =================== 数据初始化 ===================
  const initData = async () => {
    const {
      requestBase: importRequestBase,
      queryParams: importQueryParams,
      bodyParams: importBodyParams,
      isCover,
    } = importData || {}
    const data = await RequestParamsStorage.get(S_SAVE_KEY)
    const proxyData = await RequestParamsStorage.get(S_SAVE_REPO_KEY)
    let { base, params } = data || {}
    if (!base) {
      base = {
        method: itf.method,
        bodyOption: itf.bodyOption,
        path: itf.url,
        byProxy: false,
      }
    }

    base = isCover ? importRequestBase : mergeObject(base, importRequestBase)

    base.byProxy = proxyData?.byProxy ?? importRequestBase?.byProxy
    base.bodyOption = base.bodyOption || DefaultBaseData.bodyOption

    if (!params) {
      const properties = cloneDeep(itf.properties)
      let headerParams = filterProperties(properties, ParamsPanelDefine.headerParams.scope, ParamsPanelDefine.headerParams.posFilter)
      let queryParams = filterProperties(properties, ParamsPanelDefine.queryParams.scope, ParamsPanelDefine.queryParams.posFilter)
      let bodyParams = filterProperties(properties, ParamsPanelDefine.bodyParams.scope, ParamsPanelDefine.bodyParams.posFilter)

      headerParams = mockPropertiesValue(headerParams)
      queryParams = mockPropertiesValue(queryParams)
      bodyParams = mockPropertiesValue(bodyParams)

      params = {
        headerParams: headerParams?.length ? headerParams : null,
        queryParams: queryParams?.length ? queryParams : null,
        bodyParams: bodyParams?.length ? bodyParams : null,
      }
    } else {
      updatePropertiesOfID(params.headerParams)
      updatePropertiesOfID(params.queryParams)
      updatePropertiesOfID(params.bodyParams)
    }

    params.queryParams = isCover ? importQueryParams : mergeObjectListBy<FreePropertyType>(params.queryParams, importQueryParams, 'name')
    params.bodyParams = isCover ? importBodyParams : mergeObjectListBy<FreePropertyType>(params.bodyParams, importBodyParams, 'name')

    setBase(base)
    setParams(params)
  }
  useEffect(() => {
    initData()
  }, [importData])
  // =================== //数据初始化 ===================

  // =================== 数据保存 ===================
  const saveData = () => {
    // TODO：先不存储了，涉及文档更新后字段名同步问题，以后可以加JSONSchema校验
    RequestParamsStorage.set(S_SAVE_KEY, { base, params }, ExpireTimeEnum.oneDay * 3)
    RequestParamsStorage.set(S_SAVE_REPO_KEY, { byProxy: base?.byProxy }, ExpireTimeEnum.oneMonth)
  }
  // =================== //数据保存 ===================

  useImperativeHandle(ref, () => ({
    saveData: saveData,
  }))

  // =================== 基本数据编辑 ===================
  const [isLoading, setIsLoading] = useState(false)
  const handleDataChange = (name: string, value: any) => {
    setBase({
      ...base,
      [name]: value,
    })
  }
  const handleInvoke = () => {
    setIsLoading(true)
    saveData()
    onInvoke && onInvoke(base, params, () => {
      setIsLoading(false)
    }, () => {
      setIsLoading(false)
    })
  }
  // =================== //基本数据编辑 ===================

  // ==================== 参数Form编辑器 ====================
  const handleChangeProperty = (property: any, id) => {
    const properties = params[id]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      setParams({
        ...params,
        [id]: properties,
      })
    }
  }
  const handleDeleteMemoryProperty = (property: any, cb: any, id: string) => {
    const properties = params[id]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1)

      // 清除后代属性
      const deletedParentIds = [property.id]
      for (let index = 0; index < properties.length; index++) {
        if (deletedParentIds.indexOf(properties[index].parentId) !== -1) {
          deletedParentIds.push(properties[index].id)
          properties.splice(index--, 1)
          index = 0 // 强制从头开始查找，避免漏掉后代属性
        }
      }

      setParams({
        ...params,
        [id]: properties,
      })
      cb && cb(properties)
    }
  }
  const handleAddMemoryProperty = (property: any, cb: any, id: string) => {
    handleAddMemoryProperties([property], cb, id)
  }
  const handleAddMemoryProperties = (_properties: any, cb: any, id: string) => {
    const properties = params[id]
    _properties.forEach((item: any) => {
      if (item.memory === undefined) {
        item.memory = true
      }
      if (item.id === undefined) {
        item.id = uniqueId('memory-')
      }
      if (item.repositoryId === undefined) {
        item.repositoryId = repository.id
      }
      if (item.moduleId === undefined) {
        item.moduleId = mod.id
      }
      if (item.interfaceId === undefined) {
        item.interfaceId = itf.id
      }
    })
    setParams({
      ...params,
      [id]: [...properties, ..._properties],
    })
    cb && cb(properties)
  }
  // ==================== //参数Form编辑器 ====================

  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography variant="button" display="block" gutterBottom={true} style={{ fontWeight: 600 }}>{t('Interface Path')}</Typography>
      <Formik
        initialValues={{}}
        onSubmit={() => null}>
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Grid container={true} spacing={5} style={{ margin: '-10px 0px' }}>
              <Grid item={true} xs={2}>
                <FormControlLabel
                  control={
                    <Select
                      name="method" fullWidth={true}
                      value={base?.method || DefaultBaseData.method}
                      onChange={(e) => handleDataChange('method', e?.target?.value)}
                      disabled={isLocked}>
                      {METHODS.map(method => (
                        <MenuItem key={method} value={method}>{method}</MenuItem>
                      ))}
                    </Select>
                  }
                  label={null}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item={true} xs={5}>
                <FormControlLabel
                  control={
                    <TextField
                      name="path" variant="outlined" size="small" fullWidth={true}
                      placeholder="接口地址" value={base?.path || DefaultBaseData.path}
                      onChange={(e) => handleDataChange('path', e?.target?.value)} />
                  }
                  label={null}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item={true} xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      name="byProxy" color="primary"
                      checked={base?.byProxy || DefaultBaseData.byProxy}
                      onChange={(e) => handleDataChange('byProxy', !base?.byProxy)} />
                  }
                  label={t('By Proxy')}
                  labelPlacement="start"
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item={true} xs={1}>
                <Button variant="contained" color="primary" disabled={isLoading} onClick={handleInvoke} style={{ width: '85px' }}>
                  {isLoading ? t('Loading') : t('Send')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {/* 请求参数编辑 */}
      {params &&
        Object.values(ParamsPanelDefine).map((item, index) => {
          return (
            (params[item.id]) &&
            <div key={index} style={{ marginBottom: '10px' }} className={`len-${params[item.id]?.length}`}>
              <Typography variant="button" display="block" gutterBottom={true} style={{ fontWeight: 600 }}>{t(item.title)}</Typography>
              {(item.scope === 'request' && item.posFilter === 3) && (
                <RadioGroup row={true} name="bodyOption" value={base?.bodyOption || DefaultBaseData.bodyOption}
                  onChange={(e) => handleDataChange('bodyOption', e?.target?.value)}
                  style={{ marginTop: '-15px' }}>
                  {BODY_OPTION_LIST.map(x => (
                    <FormControlLabel key={x.value} value={x.value} control={<Radio />} label={x.label} disabled={isLocked} />
                  ))}
                </RadioGroup>
              )}
              <ParamsEditor editable={true}
                // itf={itf}
                interfaceId={itf.id}
                autoMock={false}

                properties={params[item.id]}
                scope={item.scope}
                bodyOption={itf.bodyOption}
                posFilter={item.posFilter}

                handleChangeProperty={(property) => handleChangeProperty(property, item.id)}
                handleAddMemoryProperty={(property, cb) => handleAddMemoryProperty(property, cb, item.id)}
                handleDeleteMemoryProperty={(property, cb) => handleDeleteMemoryProperty(property, cb, item.id)}
              />
            </div>
          )
        })
      }
    </div>
  )
}

const RequestParamsWrapper = forwardRef(RequestParams)

const DefaultTViewerOptions = {
  mode: 'preview',
  // modes: ['preview', 'view'],
}
const DefaultRViewerOptions = {
  mode: 'code',
  // modes: ['code', 'tree'],
}
function ResponseValidator(props: ResponseValidatorProps) {
  const { itf, mod, repository, responseData } = props
  const { t } = useTranslation()

  const $targetViewer = useRef<IJSONEditorInstance>(null)
  const [TViewerOptions, setTViewerOptions] = useState<IJSONEditorOptions>(null)

  const $responseViewer = useRef<IJSONEditorInstance>(null)
  const [RViewerOptions, setRViewerOptions] = useState<IJSONEditorOptions>(null)

  const [errors, setErrors] = useState<IValidateError[]>(null)

  // const S_SAVE_KEY = `P${repository.id}.M${mod.id}.I${itf.id}-TargetResponse` // 按照仓库级别保存接口服务基本信息
  const S_SAVE_KEY = `P${repository.id}.M${mod.id}.I${itf.id}` // 按照仓库级别保存接口服务基本信息

  // ================== 数据初始化：目标结果数据生成和options生成 ==================
  const initOptions = () => {
    const schema = createJSONSchema(itf, 'response')
    setTViewerOptions({
      ...DefaultTViewerOptions,
      schema,
    })
    setRViewerOptions({
      ...DefaultRViewerOptions,
      schema,
    })
  }
  const initData = async () => {
    let data = await TargetResponseStorage.get(S_SAVE_KEY)
    if (!data) {
      data = createJSONData(itf, 'response')
    }
    $targetViewer.current?.setJSON(data)
  }

  useEffect(() => {
    initOptions()
    initData()
  }, [])
  // ================== // 生成目标结果的JSON数据 ==================

  // ================== 设置接口参数 ==================
  const customValidate = (responseData: any) => {
    const errors = $responseViewer.current?.validate(responseData)
    const mergedErrors = mergeValidateErrors(errors)

    setErrors(mergedErrors)
  }
  useEffect(() => {
    $responseViewer.current?.setJSON(responseData)
    customValidate(responseData) // 进行自定义校验
  }, [responseData])
  // ================== //设置接口参数 ==================

  return (
    <Grid className='ResponseValidator' container={true} spacing={5}>
      <Grid item={true} xs={6}>
        {RViewerOptions && <JSONEditor name="responseViewer" ref={$responseViewer} height={350} options={RViewerOptions} />}
      </Grid>
      <Grid item={true} xs={6}>
        {TViewerOptions && <JSONEditor name="targetViewer" ref={$targetViewer} height={350} options={TViewerOptions} />}
      </Grid>
      <Grid className='errorList' item={true} xs={12} style={{ marginTop: '-20px' }}>
        {errors && errors.map((item, index) => (
          <MuiAlert className='alertMsg' key={index} variant="outlined"
            severity={item.keyword === 'additionalProperties' ? 'warning' : 'error'}>
            {/* {`response${item.dataPath} ${item.message}${item.keyword === 'additionalProperties' ? ' : ' + item.params['additionalProperty'] : ''}`} */}
            {`${index + 1}) response${item.dataPath} ${item.message}${item.keyword === 'additionalProperties' ? ` : ${item?._fields?.join(', ')}` : ''}`}
          </MuiAlert>
        ))}
        {(responseData && !errors)
          && <MuiAlert className='alertMsg' variant="outlined" severity="success">{t('Validate Success')}</MuiAlert>}
      </Grid>
    </Grid>
  )
}

