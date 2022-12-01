/*
 * @Author: xia xian
 * @Date: 2022-10-27 14:47:45
 * @LastEditors: xia xian
 * @LastEditTime: 2022-10-28 10:17:04
 * @Description:
 */
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Transition from 'components/common/Transition'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import VersionSelect from './VersionSelect'
import { useSnackbar } from 'notistack'
interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  repositoryId?: number
}

function VersionForm(props: Props) {
  const { open, onClose, title, repositoryId } = props
  const { t } = useTranslation()
  const DefaultVersion = {label: 'master', id: null}
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
              ...{ version1: DefaultVersion, version2: DefaultVersion },
            }}
            onSubmit={async (values) => {
              const { version1, version2 } = values
              if (version1.id === version2.id) {
                enqueueSnackbar(t('They are the same version'), { variant: 'error' })
              } else {
                window.open(`${window.location.origin}/repository/diff/${repositoryId}/${repositoryId}/${version1.id}/${version2.id}`, '_blank')
                onClose(true)
              }
            }}

          >
            {({ isSubmitting, setFieldValue }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <Box sx={{ mb: 1 }}>
                      <VersionSelect
                        repositoryId={repositoryId}
                        label="Version1"
                        onChange={v => {
                          if (v) {
                            setFieldValue('version1', v)
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <VersionSelect
                        repositoryId={repositoryId}
                        label="Version2"
                        onChange={v => {
                          if (v) {
                            setFieldValue('version2', v)
                          }
                        }}
                      />
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
