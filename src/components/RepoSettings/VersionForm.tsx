import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Transition from 'components/common/Transition'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { YUP_MSG } from '../../family/UIConst'
import VersionService from '../../relatives/services/Version'
import VersionSelect from './VersionSelect'
interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  repositoryId?: number
}

function VersionForm(props: Props) {
  const { open, onClose, title, repositoryId } = props
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    name: Yup.string().required(msg.REQUIRED).max(40, msg.MAX_LENGTH(40)),
    target: Yup.string().required(msg.REQUIRED),
  })
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ minWidth: '500px' }}>
          <Formik
            initialValues={{
              ...{ name: '', target: 'master' },
            }}
            validationSchema={schema}
            onSubmit={async (values) => {
              const version = {
                ...values,
                repositoryId,
              }
              const result = await VersionService.addVersion(version)
              if (!result.isOk) {
                enqueueSnackbar(result.errMsg, { variant: 'error' })
              }
              onClose(true)
            }}

          >
            {({ errors, isSubmitting, setFieldValue }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="name"
                        label={t('Name')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <VersionSelect
                        repositoryId={repositoryId}
                        label={`${t('Target')}${t('Version')}`}
                        onChange={v => {
                          if (v) {
                            setFieldValue('target', v.label)
                          }
                        }}
                      />
                      {errors.target ? (
                        <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium css-e32pdp-MuiFormHelperText-root" id="mui-70-helper-text">{errors.target}</p>
                      ) : null}
                    </Box>
                  </div>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mr1"
                      disabled={isSubmitting}
                      sx={{ mr: 1 }}
                    >
                      {t('submit')}
                    </Button>
                    <Button
                      onClick={() => onClose()}
                      disabled={isSubmitting}
                    >
                      {t('cancel')}
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default VersionForm
