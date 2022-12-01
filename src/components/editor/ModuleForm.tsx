import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Transition from 'components/common/Transition'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { addModule, updateModule } from '../../actions/module'
import { Module, Repository, RootState } from '../../actions/types'
import { YUP_MSG } from '../../family/UIConst'


const FORM_STATE_INIT: Module = {
  id: 0,
  name: '',
  description: '',
  repositoryid: 0,
  priority: 1,
}

interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  module?: Module
  repository?: Repository
}

function ModuleForm(props: Props) {
  const auth = useSelector((state: RootState) => state.auth)
  const { open, onClose, module, title, repository } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    name: Yup.string().required(msg.REQUIRED).max(40, msg.MAX_LENGTH(40)),
    description: Yup.string().max(1000, msg.MAX_LENGTH(1000)),
  })
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
              ...FORM_STATE_INIT,
              ...(module || {}),
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              const addOrUpdateModule = values.id ? updateModule : addModule
              const module: Module = {
                ...values,
                creatorId: auth.id,
                repositoryId: repository!.id,
                versionId: repository.version?.id,
              }
              dispatch(addOrUpdateModule(module, () => {
                onClose(true)
              }))
            }}

          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="name"
                        label={t('The name of the module')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="description"
                        label={t('Introduction of the module')}
                        component={TextField}
                        multiline={true}
                        fullWidth={true}
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

export default ModuleForm
