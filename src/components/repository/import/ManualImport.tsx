import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { importSwaggerRepository } from '../../../actions/repository'
import { ImportSwagger } from '../../../actions/types'
import RepositoryService from '../../../relatives/services/Repository'
import { convert } from 'rap-import-utils'
import { useConfirm } from 'hooks/useConfirm'

const schema = Yup.object().shape({
  docUrl: Yup.string(),
  swagger: Yup.string(),
})
export enum COVER_TYPE {
  CREATE = 1,
  COVER = 2,
}
const FORM_STATE_INIT: ImportSwagger = {
  version: 1,
  docUrl: '',
  orgId: 0,
  mode: 'manual',
  swagger: '',
  repositoryId: 0,
  cover: COVER_TYPE.COVER,
}

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  orgId?: number
  repositoryId?: number
  mode: string
  modId?: number
  versionId?: number
}

export enum IMPORT_TYPE {
  /** 从Swagger 2.0 URL 或 JSON 文件导入 */
  SWAGGER_2_0 = 1,
  /** 从RAP2改动时系统生成的备份JSON文件导入 */
  RAP2_ITF_BACKUP = 2,
  RAP = 3,
  /** 从YAPI导入 */
  YAPI = 4,
  /** 从protobuf3 导入 */
  PB3 = 5,
}

export enum IMPORT_MODE {
  Manual,
  Regular
}

function ManualImport(props: Props) {
  const { onClose, orgId, mode, repositoryId, modId, versionId } = props
  const dispatch = useDispatch()
  const [alertOpen, setAlertOpen] = useState({ op: false, msg: '' })
  const { t } = useTranslation()
  const confirm = useConfirm()
  return (
    <Box component="section" sx={{ display: 'inline' }}>
      <Box sx={{ minWidth: '500px', minHeight: '160px' }}>
        <Formik
          initialValues={{
            ...FORM_STATE_INIT,
          }}
          validationSchema={schema}
          onSubmit={async (values, actions) => {
            const modeLabel = values.cover === COVER_TYPE.COVER ? t('Cover') : t('Add new')
            confirm({
              content: `${t('Merge pattern')}："${modeLabel.toLowerCase()}", ${t('confirm import')}?`,
            }).then(async () => {
              let swagger = values.swagger
              if (!swagger && values.docUrl) {
                try {
                  swagger = await RepositoryService.getSwaggerRepository({
                    docUrl: values.docUrl,
                  })
                  if (typeof swagger === 'object') {
                    const { errMsg } = swagger
                    if (errMsg) {
                      setAlertOpen({
                        op: true,
                        msg: errMsg,
                      })
                      actions.setSubmitting(false)
                      return
                    }
                  }
                } catch (error) {
                  setAlertOpen({
                    op: true,
                    msg: t(
                      'Unable to obtain data, please check whether your service allows CORS, or use directly paste JSON import'
                    ),
                  })
                  actions.setSubmitting(false)
                  return
                }
              } else {
                try {
                  swagger = convert(swagger, values.version)
                } catch (error) {
                  setAlertOpen({
                    op: true,
                    msg: t('Parsing, failure is not a valid scehma, please check the format'),
                  })
                  actions.setSubmitting(false)
                  return
                }
              }
              const importSwagger: ImportSwagger = {
                ...values,
                mode,
                swagger,
                orgId,
                repositoryId,
                modId,
                versionId,
              }
              const submitPromise = new Promise((resolve) => {
                dispatch(
                  importSwaggerRepository(importSwagger, (res: any) => {
                    if (res.isOk) {
                      setAlertOpen({
                        op: true,
                        msg: res.type === 'async' ? t('Import async') : t('Import success'),
                      })
                      setTimeout(() => {
                        window.location.reload()
                      }, 4000)
                    } else {
                      setAlertOpen({
                        op: true,
                        msg: `${t('importFailed')}：${res.message || res.errMsg}.`,
                      })
                    }
                    onClose(true)
                    resolve(null)
                  })
                )
              })

              await submitPromise
            })
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => {
            return (
              <Form>
                <div className="rmodal-body">
                  <Box sx={{ fontSize: '14px' }}>{t('Data resource')}：</Box>
                  <Box sx={{ mb: 1 }}>
                    <RadioGroup
                      name="radioListOp"
                      value={values.version}
                      onChange={(e) => {
                        setFieldValue('version', +e.target.value)
                      }}
                      row={true}
                    >
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={IMPORT_TYPE.SWAGGER_2_0}
                        control={<Radio />}
                        label="Swagger 2.0"
                      />
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={IMPORT_TYPE.RAP2_ITF_BACKUP}
                        control={<Radio />}
                        label={t('RAP2 interface backup JSON')}
                      />
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={IMPORT_TYPE.YAPI}
                        control={<Radio />}
                        label="YAPI"
                      />
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={IMPORT_TYPE.PB3}
                        control={<Radio />}
                        label="PB"
                      />
                    </RadioGroup>
                  </Box>
                  <Box sx={{ fontSize: '14px' }}>
                    {t('Merge pattern')}：
                    <Tooltip title={t('mergeTip')} placement="right-start">
                      <HelpOutlineOutlinedIcon
                        sx={{
                          fontSize: '18px',
                          color: '#3f51b5',
                          cursor: 'pointer',
                          marginTop: '-2px',
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <RadioGroup
                      name="radioListOp"
                      value={values.cover}
                      onChange={(e) => {
                        setFieldValue('cover', +e.target.value)
                      }}
                      row={true}
                    >
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={COVER_TYPE.COVER}
                        control={<Radio />}
                        label={t('Cover')}
                      />
                      <FormControlLabel
                        disabled={isSubmitting}
                        value={COVER_TYPE.CREATE}
                        control={<Radio />}
                        label={t('Add new')}
                      />
                    </RadioGroup>
                  </Box>
                  {(values.version === IMPORT_TYPE.SWAGGER_2_0 ||
                        values.version === IMPORT_TYPE.RAP2_ITF_BACKUP) && (
                    <Box sx={{ mb: 1 }}>
                      <Field
                        placeholder=""
                        name="docUrl"
                        label={t('From URL')}
                        component={TextField}
                        fullWidth={true}
                        variant="outlined"
                        disabled={isSubmitting}
                      />
                    </Box>
                  )}
                  <Box sx={{ mb: 1 }}>
                    <Field
                      placeholder=""
                      name="swagger"
                      label={
                        values.version === IMPORT_TYPE.SWAGGER_2_0
                          ? `${t('copySwaggerJson')}`
                          : `${t('copyJson')}`
                      }
                      component={TextField}
                      fullWidth={true}
                      multiline={true}
                      rows="4"
                      variant="outlined"
                      disabled={isSubmitting}
                    />
                  </Box>
                </div>
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color={isSubmitting ? 'inherit' : 'primary'}
                    className="mr1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? `${t('importingMsg')}...` : `${t('submit')}`}
                  </Button>
                  {!isSubmitting && (
                    <Button onClick={() => onClose()} disabled={isSubmitting}>
                      {t('cancel')}
                    </Button>
                  )}
                </Box>
              </Form>
            )
          }}
        </Formik>
      </Box>
      <Dialog
        open={alertOpen.op}
        onClose={() => setAlertOpen({ op: false, msg: '' })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('prompt')}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ minWidth: '500px', minHeight: '7px' }}
          >
            {alertOpen.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen({ op: false, msg: '' })} color="primary">
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManualImport
