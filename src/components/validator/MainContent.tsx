
import { Button, Container, Grid, Tab, Tabs, TextareaAutosize } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TabPanel } from '../utils/TabPanel'
// 类型定义
import { CommonProps, IBaseServerSettingData, InitDataType, IRequestBaseData } from './types'

import { Interface } from 'actions/types'
import { BODY_OPTION } from 'components/editor/InterfaceSummary'
import { createPropertiesFromJSON } from 'components/JSONEditor/JSONEditorUtils'
import { Form, Formik } from 'formik'
import { uniqueId } from 'lodash'
import { getCurlParams, IGetCurlParamsResult } from 'utils/URLUtils'
import BasePanel from './BasePanel'
import PopperContainer from './PopperContainer'
import RequestPanel from './RequestPanel'
import TargetPanel from './TargetPanel'

/**
 * tabs数据定义
 */
const DefineTabs = [
  { label: 'Base Setting', component: BasePanel },
  { label: 'Target Result', component: TargetPanel },
  { label: 'Request Interface', component: RequestPanel },
]

export default function MainContent(props: CommonProps) {
  const { itf } = props
  const { t } = useTranslation()
  const [value, setValue] = useState(0)
  const $Panels = useRef(null)

  const handleChange = async (event: any, newValue: number) => {
    // 先校验数据是否已经保存
    // TODO：要么延时切换（自动保存是异步存储到IndexedDB），要么提示用户手动保存

    try {
      $Panels!.current?.checkAndAutoSave()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('auto save error:', e)
    } finally {
      setTimeout(() => {
        setValue(newValue)
      }, 150)
    }
  }

  const [importData, setImportData] = useState<InitDataType>(null)
  const handleSubmit = (data: IGetCurlParamsResult) => {
    const importData = parseImportData(data, itf)
    setImportData(importData)
  }

  return (
    <Container className='MainContent' fixed={true}>
      <div className='tabsContainer'>
        {/* tab切换按钮 */}
        <Tabs className='tabs' indicatorColor='primary' textColor='primary'
          TabIndicatorProps={{ style: { top: 0 } }}
          value={value} onChange={handleChange}>
          {DefineTabs.map((item, index) => {
            return <Tab className='tab' key={index} label={t(item.label)} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
          })}
        </Tabs>
        {/* 全局操作按钮组 */}
        <div className='buttons'>
          <PopperContainer
            trigger={(triggerProps) => (
              <Button variant="contained" size="medium" color="primary" {...triggerProps}>{t('Import')}</Button>
            )}
          >
            {(popperProps) => (
              <ImportForm {...props} onSubmit={handleSubmit} onClose={popperProps.close} />
            )}
          </PopperContainer>
        </div>
      </div>

      {/* tab面板列表 */}
      {DefineTabs.map((item, index) => {
        return (
          <TabPanel key={index} value={value} index={index}>
            <item.component ref={$Panels} {...props} importData={importData} />
          </TabPanel>
        )
      })}
    </Container>
  )
}

const BodyOptionMap = {
  raw: BODY_OPTION.RAW,
  formdata: BODY_OPTION.FORM_DATA,
  urlencoded: BODY_OPTION.FORM_URLENCODED,
}

function parseImportData(data: IGetCurlParamsResult, itf: Interface): InitDataType {
  const {
    hostname, port, protocol, pathname,
    method, body: bodyData, query,
    headers, header,
    isCover,
  } = data
  const { url } = itf

  const lastIndex = pathname.lastIndexOf(url)
  const basePath = lastIndex > 0 ? pathname.substring(0, lastIndex) : ''
  const path = lastIndex > 0 ? pathname.substring(lastIndex) : pathname

  const useSSL = protocol?.toLowerCase() === 'https'

  const baseServer: IBaseServerSettingData = {
    domain: hostname,
    basePath,
    protocolType: 'http',
    useSSL,
    withCookie: false,
  }
  if (port) {
    baseServer.port = +port
  } else {
    baseServer.port = useSSL ? 443 : 80
  }

  const requestBase: IRequestBaseData = {
    method,
    bodyOption: BodyOptionMap[bodyData?.mode],
    path,
    byProxy: true,
  }

  const globalHeader = header.map(({ key, value }) => ({
    id: uniqueId('import_'),
    name: key,
    value,
    parentId: -1,
    scope: 'globalHeaders',
    type: 'String',
  }))

  let queryParams = null
  if (query) {
    queryParams = createPropertiesFromJSON(query)
  }

  const bodyContext = bodyData[bodyData?.mode]
  let body = null
  if (bodyContext) {
    try {
      body = JSON.parse(bodyContext)
    } catch (e) {
      // eslint-disable-line
    }
  }

  let bodyParams = null
  if (body) {
    bodyParams = createPropertiesFromJSON(body)
  }

  return {
    baseServer,
    requestBase,
    headers,
    query,
    body,
    globalHeader,
    queryParams,
    bodyParams,
    isCover,
  }
}


interface ImportFormType extends Omit<CommonProps, 'importData'> {
  onSubmit: (data: IGetCurlParamsResult) => void
  onClose?: () => void
}
type ImportFormDataType = {
  text?: string
}
function ImportForm(props: ImportFormType) {
  const { t } = useTranslation()
  const { onSubmit, onClose, itf } = props

  const { enqueueSnackbar } = useSnackbar()

  const checkInterfaceMatch = (data: IGetCurlParamsResult) => {
    const { method, pathname } = data
    const { method: itfMethod, url: itfUrl } = itf

    if (method !== itfMethod) {
      return {
        isMatch: false,
        message: `${method} method does not match the interface definition [${itfMethod}].`,
      }
    }

    if (pathname.indexOf(itfUrl) < 0) {
      return {
        isMatch: false,
        message: `${pathname} does not match the interface definition [${itfUrl}].`,
      }
    }

    return { isMatch: true, message: 'success' }
  }

  return (
    <Formik<ImportFormDataType>
      initialValues={{
        text: '',
      }}
      onSubmit={async (values) => {
        const curlParams = await getCurlParams(values?.text)

        if (!curlParams) {
          enqueueSnackbar('Parse cURL command error.', { variant: 'error' })
          return
        }

        const { isMatch, message } = checkInterfaceMatch(curlParams)
        if (!isMatch) {
          enqueueSnackbar(message, { variant: 'error' })
          return
        }

        curlParams.isCover = true
        try {
          onSubmit(curlParams)
        } catch (e) {
          // eslint-disable-line
        } finally {
          onClose && onClose()
        }
      }}
      onReset={() => {
        onClose && onClose()
      }}
    >
      {(props) => (
        <Form className='ImportForm' onSubmit={props.handleSubmit} onChange={props.handleChange} onReset={props.handleReset}>
          <Grid container={true}>
            <Grid item={true} xs={12} >
              <TextareaAutosize name='text'
                maxRows={10} minRows={10} style={{ resize: 'none', width: '100%' }}
                placeholder={t('Import Text')}
                value={props.values?.text}
              />
            </Grid>
            <Grid item={true} xs={12} style={{ display: 'inline-flex', justifyContent: 'flex-end' }}>
              <Button type='reset' size="small">{t('cancel')}</Button>
              <Button type='submit' size="small" color="primary">{t('confirm')}</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik >
  )
}
