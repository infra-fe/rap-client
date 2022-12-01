import { FormControlLabel, Grid, MenuItem, Select, Switch, TextField } from '@mui/material'
import { Form, Formik } from 'formik'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiEditAlt } from 'react-icons/bi'
import { GiConfirmed } from 'react-icons/gi'
import * as Yup from 'yup'
import PanelTitle from './PanelTitle'

import { updatePropertiesOfID } from '../JSONEditor/JSONEditorUtils'
import ParamsEditor from '../ParamsEditor/ParamsEditor'
// import GridJSONEditor from '../ParamsEditor/GridJSONEditor'
import { getDefaultServer } from './RequestUtils'

import { cloneDeep, uniqueId } from 'lodash'
import { BaseServerStorage, ExpireTimeEnum, GlobalHeadersStorage } from 'utils/Storage'

// 类型定义
import { Property } from 'actions/types'
import { mergeObject, mergeObjectListBy } from 'utils/DataUtils'
import { BaseServerSettingProps, CommonProps, FreePropertyType, IBaseServerSettingData, ICheckSavedResult } from './types'

function FormLabel(props) {
  const { required, text } = props
  return (
    <span style={{ fontWeight: 600 }}>
      {required && (<span style={{ color: 'red' }}>*</span>)}
      {text}
    </span>
  )
}

export function BasePanel(props: CommonProps, ref: any) {
  const { t } = useTranslation()
  const $BaseServer = useRef(null)
  const $GlobalHeaders = useRef(null)

  // 编辑按钮状态控制
  const [isServerLocked, setIsServerLocked] = useState(true)

  const [isHeadersLocked, setIsHeadersLocked] = useState(true)

  const handleEditService = () => {
    setIsServerLocked(false)
  }
  const handleSaveService = () => {

    // 调用子组建的保存方法
    try {
      $BaseServer?.current?.saveData()
      setIsServerLocked(true)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('the base server is saved error:', e)
    }
  }
  const handleEditHeaders = () => {
    setIsHeadersLocked(false)
  }
  const handleSaveHeaders = () => {
    // 调用子组建的保存方法
    try {
      $GlobalHeaders?.current?.saveData()
      setIsHeadersLocked(true)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('the global headers is saved error:', e)
    }
  }

  // ================ 非受控方法 ================
  const checkSaved: () => ICheckSavedResult = () => {
    const isSaved = isServerLocked && isHeadersLocked
    let message = ''

    if (!isSaved) {
      if (!isServerLocked) {
        message = t('Base Server Setting Not Saved')
      } else if (!isHeadersLocked) {
        message = t('Global Headers Setting Not Saved')
      }
    }

    return {
      isSaved,
      message,
    }
  }
  const checkAndAutoSave = () => {
    if (!isServerLocked) {
      handleSaveService()
    }
    if (!isHeadersLocked) {
      handleSaveHeaders()
    }
  }
  useImperativeHandle(ref, () => ({
    checkSaved: checkSaved,
    checkAndAutoSave: checkAndAutoSave,
  }))
  // ================ //非受控方法 ================

  return (
    <div className='BasePanel'>
      {/* 接口服务配置 */}
      <PanelTitle text={t('Setting Base Server')}
        buttons={[
          { icon: BiEditAlt, props: { disabled: !isServerLocked, onClick: handleEditService } },
          { icon: GiConfirmed, props: { disabled: isServerLocked, onClick: handleSaveService } },
        ]} />
      <BaseServerSettingWrapper ref={$BaseServer} disabled={isServerLocked} {...props} />

      {/* 全局头信息配置 */}
      <PanelTitle text={t('Global Headers Setting')}
        buttons={[
          { icon: BiEditAlt, props: { disabled: !isHeadersLocked, onClick: handleEditHeaders } },
          { icon: GiConfirmed, props: { disabled: isHeadersLocked, onClick: handleSaveHeaders } },
        ]} />
      <GlobalHeadersSettingWrapper ref={$GlobalHeaders} editable={!isHeadersLocked} {...props} />
    </div>
  )
}

const BasePanelWrapper = forwardRef(BasePanel)
export default BasePanelWrapper

/**
 * 服务基本信息配置表单
 * @param props
 * @returns
 */
function BaseServerSetting(props: BaseServerSettingProps, ref: any) {
  const { t } = useTranslation()

  const { disabled, repository, itf, importData } = props
  const [data, setData] = useState<IBaseServerSettingData>(
    getDefaultServer({ repositoryId: repository.id, requestMethod: itf.method })
  )

  // const S_SAVE_KEY = `P${repository.id}-BaseServerSetting` // 按照仓库级别保存接口服务基本信息
  const S_SAVE_KEY = `P${repository.id}` // 按照仓库级别保存接口服务基本信息

  // 数据初始化
  const initData = async () => {
    const { baseServer: importBaseServer, isCover } = importData || {}
    const data = await BaseServerStorage.get(S_SAVE_KEY)

    const baseServer = isCover ? importBaseServer : mergeObject(data, importBaseServer)
    if (baseServer) {
      setData(baseServer)
    }
  }
  useEffect(() => {
    initData()

    return () => {
      // 切换tab时，销毁本组件，把结果自动保存下
      // if (!disabled) {
      //   saveData()
      // }
    }
  }, [importData])

  // 数据更新
  const handleDataChange = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value,
    })
  }

  // 数据保存
  const saveData = () => {
    BaseServerStorage.set(S_SAVE_KEY, data, ExpireTimeEnum.oneMonth)
  }
  useImperativeHandle(ref, () => ({
    saveData: saveData,
  }))

  // ================ Formik操作 ================
  // TODO 提供个简单的参数校验，要换成formik的标准操作
  const checkRules = {
    domain: Yup.string()
      .required(t('required1'))
      .matches(/^(localhost|127.0.0.1|(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+)$/, `${t('format error')}`),
  }
  const [errors, setErrors] = useState({ domain: '' })

  const checkErrors = async (key: string, value: any) => {
    const checkRule = checkRules[key]
    if (checkRule) {
      checkRule.validate(value).then((res: any) => {
        setErrors({
          ...errors,
          [key]: '',
        })
      }).catch((err: any) => {
        setErrors({
          ...errors,
          [key]: err.message,
        })
      })
    }
  }
  // ================ //Formik操作 ================

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => null}>
      {(props) => (
        <Form className='BaseServerSetting' onSubmit={props.handleSubmit}>
          <Grid className='container' container={true} spacing={5}>
            <Grid item={true} xs={4}>
              <FormControlLabel
                className='formItem'
                control={
                  <TextField
                    name="domain" variant="outlined" size="small" fullWidth={true}
                    placeholder={t('Domain Or IP Placeholder')} value={data?.domain}
                    error={Boolean(errors.domain)}
                    helperText={errors.domain}
                    onChange={(e) => {
                      const domain = e?.target?.value
                      handleDataChange('domain', domain)
                      checkErrors('domain', domain)
                    }} />
                }
                label={<FormLabel required={true} text={t('Domain Or IP')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <FormControlLabel
                className='formItem'
                control={
                  <TextField
                    name="port" variant="outlined" size="small" fullWidth={true}
                    type="number" placeholder={t('Port Placeholder')} value={data?.port}
                    onChange={(e) => handleDataChange('port', e?.target?.value)} />
                }
                label={<FormLabel text={t('Port')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
            <Grid item={true} xs={5}>
              <FormControlLabel
                className='formItem'
                control={
                  <TextField
                    name="basePath" variant="outlined" size="small" fullWidth={true}
                    placeholder={t('BasePath Placeholder')} value={data?.basePath}
                    onChange={(e) => handleDataChange('basePath', e?.target?.value)} />
                }
                label={<FormLabel required={true} text={t('BasePath')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
            <Grid item={true} xs={4}>
              <FormControlLabel
                className='formItem'
                control={
                  <Select
                    name="protocolType" fullWidth={true}
                    value={data?.protocolType}
                    onChange={(e) => handleDataChange('protocolType', e?.target?.value)}>
                    <MenuItem value="http">HTTP RESTful</MenuItem>
                    <MenuItem value="websocket" disabled={true}>WebSocket</MenuItem>
                    <MenuItem value="rpc" disabled={true}>RPC</MenuItem>
                  </Select>
                }
                label={<FormLabel required={true} text={t('Protocol Type')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <FormControlLabel
                className='formItem'
                control={
                  <Switch
                    className="formSwitch" name="useSSL" color="primary"
                    checked={data?.useSSL}
                    onChange={() => handleDataChange('useSSL', !data?.useSSL)} />
                }
                label={<FormLabel required={false} text={t('Use SSL')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <FormControlLabel
                className='formItem'
                control={
                  <Switch
                    className="formSwitch" name="withCookie" color="primary"
                    checked={data?.withCookie}
                    onChange={() => handleDataChange('withCookie', !data?.withCookie)} />
                }
                label={<FormLabel required={false} text={t('With Cookie')} />}
                labelPlacement="top"
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}
/**
 * 包装一下，使父组件可以直接调用子组件的方法
 */
const BaseServerSettingWrapper = forwardRef(BaseServerSetting)

/**
 * 全局头信息编辑
 * TODO 编辑对象类型字段还有问题
 * @param props
 * @param ref
 * @returns
 */
function GlobalHeadersSetting(props: any, ref: any) {
  const { itf, mod, repository, importData, editable } = props

  const [properties, setProperties] = useState([])

  // const S_SAVE_KEY = `P${repository.id}-GlobalHeadersSetting` // 按照仓库级别保存
  const S_SAVE_KEY = `P${repository.id}` // 按照仓库级别保存

  // ==================== 数据初始化 ====================
  const initData = async () => {
    const { globalHeader: importGlobalHeader, isCover } = importData || {}
    const data = await GlobalHeadersStorage.get(S_SAVE_KEY)

    const globalHeader = isCover ? importGlobalHeader : mergeObjectListBy<FreePropertyType>(data, importGlobalHeader, 'name') as Property[]

    if (globalHeader) {
      updatePropertiesOfID(globalHeader)
      setProperties(globalHeader)
    }
  }
  useEffect(() => {
    initData()

    return () => {
      // 切换tab时，销毁本组件，把结果自动保存下
      // if (editable) {
      //   saveData()
      // }
    }
  }, [importData])
  // useEffect(() => {
  // }, [properties])
  // ==================== // 数据初始化 ====================

  // ==================== 数据保存 ====================
  // 数据保存
  const saveData = () => {
    GlobalHeadersStorage.set(S_SAVE_KEY, properties, ExpireTimeEnum.oneMonth)
  }
  useImperativeHandle(ref, () => ({
    saveData: saveData,
  }))
  // ==================== //数据保存 ====================

  // ==================== 参数Form编辑器 ====================
  const handleChangeProperty = (property: any) => {
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      setProperties([...properties]) // 要传入新对象，不然没法出发UI更新
    }
  }
  const handleDeleteMemoryProperty = (property: any, cb: any) => {
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

      setProperties([...properties])
      cb && cb(properties)
    }
  }
  const handleAddMemoryProperty = (property: any, cb: any) => {
    handleAddMemoryProperties([property], cb)
  }
  const handleAddMemoryProperties = (newProperties: any, cb: any) => {
    newProperties.forEach((item: any) => {
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
    setProperties([...properties, ...newProperties])
    cb && cb(properties)
  }
  // ==================== //参数Form编辑器 ====================

  return (
    <ParamsEditor
      editable={editable}

      interfaceId={itf.id}
      autoMock={false}
      properties={cloneDeep(properties)}

      scope="globalHeaders"
      // posFilter={2}
      // bodyOption={itf.bodyOption}

      handleChangeProperty={handleChangeProperty}
      handleAddMemoryProperty={handleAddMemoryProperty}
      handleDeleteMemoryProperty={handleDeleteMemoryProperty}
    />
  )
}

/**
 * 包装一下，使父组件可以直接调用子组件的方法
 */
const GlobalHeadersSettingWrapper = forwardRef(GlobalHeadersSetting)
