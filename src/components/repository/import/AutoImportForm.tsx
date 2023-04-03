import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { Box, RadioGroup, FormControlLabel, Radio} from '@mui/material'
import * as AutoImportService from 'relatives/services/AutoImport'
import {FREQUENCY_TYPE, IMPORT_SOURCE, IAutoImportModel} from 'relatives/services/AutoImport'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { YUP_MSG } from 'family/UIConst'
import { useSnackbar } from 'notistack'


export enum EditType {
  Edit,
  Add,
}

interface IAutoImportFormProps {
  open: boolean
  onClose: (isOk?: boolean) => void
  editType: EditType
  initialValues: IAutoImportModel
  repositoryId?: number
  versionId?: number
}

export default function AutoImportForm(props: IAutoImportFormProps) {
  const {open, onClose, editType, initialValues, repositoryId, versionId} = props

  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    taskName: Yup.string().required(msg.REQUIRED).max(40, msg.MAX_LENGTH(40)),
    importHost: Yup.string().required(msg.REQUIRED).url(),
  })

  const { enqueueSnackbar } = useSnackbar()

  function verify(values) {
    AutoImportService.verifyImportTask({repositoryId, ...values}).then(res=>{
      if(res.isOk) {
        enqueueSnackbar('verify success!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
      } else {
        enqueueSnackbar(res.message, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
      }
    }).catch(e=>{
      enqueueSnackbar(`verify failed: ${e.message}`, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    })
  }

  return (
    <Dialog open={open} onClose={()=>onClose(false)}>
      <DialogTitle>{editType === EditType.Add ? t('Add Import Task') : t('Edit Import Task')} </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            let result
            if(editType === EditType.Add) {
              result = await AutoImportService.createAutoImport({...values, repositoryId, versionId})
            } else {
              result = await AutoImportService.updateAutoImport({id: initialValues.id, ...values, repositoryId, versionId})
            }
            if(result.isOk === false) {
              enqueueSnackbar(result.message, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
              return
            }
            onClose(true)
          }}
          validationSchema={schema}
        >
          {({ isSubmitting, setFieldValue, values, errors }) => {
            const hostLabel = values.importSource === IMPORT_SOURCE.YAPI ? 'YAPI Host' : 'Swagger Url'
            const YAPIFields = values.importSource === IMPORT_SOURCE.YAPI ? (
              <><Box sx={{ mb: 1}}>
                <Field name="importProjectId" label={'YAPI project Id'} component={TextField} fullWidth={true} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Field name="importToken" label={'YAPI project token'} component={TextField} fullWidth={true} />
              </Box></>
            ): null
            return (
              <Form>
                <Box sx={{ mb: 1 }}>
                  <Field name="taskName" label={t('Task Name')} component={TextField} fullWidth={true} />
                </Box>
                <Box sx={{ fontSize: '14px' }}>{t('Data Source')}：</Box>
                <Box sx={{ mb: 1 }}>
                  <RadioGroup
                    name="importSource"
                    value={values.importSource}
                    row={true}
                    onChange={(e) => {
                      setFieldValue('importSource', e.target.value)
                    }}
                  >
                    <FormControlLabel
                      disabled={isSubmitting}
                      value={IMPORT_SOURCE.YAPI}
                      control={<Radio />}
                      label="YAPI"
                    />
                    <FormControlLabel
                      disabled={isSubmitting}
                      value={IMPORT_SOURCE.SWAGGER}
                      control={<Radio />}
                      label="Swagger"
                    />
                  </RadioGroup>
                </Box>
                <Box sx={{ fontSize: '14px' }}>{t('Frequency')}：</Box>

                <Box sx={{ mb: 1 }}>
                  <RadioGroup
                    name="frequency"
                    value={values.frequency}
                    onChange={(e) => {
                      setFieldValue('frequency', e.target.value)
                    }}
                    row={true}
                  >
                    <FormControlLabel
                      disabled={isSubmitting}
                      value={FREQUENCY_TYPE.ThreeHours}
                      control={<Radio />}
                      label={t('ThreeHours')}
                    />
                    <FormControlLabel
                      disabled={isSubmitting}
                      value={FREQUENCY_TYPE.HalfDay}
                      control={<Radio />}
                      label={t('HalfDay')}
                    />
                    <FormControlLabel
                      disabled={isSubmitting}
                      value={FREQUENCY_TYPE.OneDay}
                      control={<Radio />}
                      label={t('OneDay')}
                    />
                  </RadioGroup>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Field name="importHost" label={hostLabel} component={TextField} fullWidth={true} />
                </Box>
                {YAPIFields}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end'}}>
                  <Button onClick={()=>verify(values)}>{t('Verify')}</Button>
                  <Button type="submit">{t('confirm')}</Button>
                  <Button onClick={()=>onClose(false)}>{t('cancel')}</Button>
                </Box>

              </Form>
            )
          }}
        </Formik>
      </DialogContent>
    </Dialog>

  )
}
