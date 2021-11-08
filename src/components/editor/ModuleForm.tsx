import { useTranslation } from 'react-i18next'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { Module, Repository, RootState } from '../../actions/types'
import { updateModule, addModule } from '../../actions/module'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: spacing(2),
    flex: 1,
  },
  preview: {
    marginTop: spacing(1),
  },
  form: {
    minWidth: 500,
  },
  formTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(3),
  },
}))


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
  const classes = useStyles()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    name: Yup.string().required(msg.REQUIRED).max(20, msg.MAX_LENGTH(20)),
    description: Yup.string().max(1000, msg.MAX_LENGTH(1000)),
  })
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.form}>
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
              }
              dispatch(addOrUpdateModule(module, () => {
                onClose(true)
              }))
            }}
            render={({ isSubmitting }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <div className={classes.formItem}>
                      <Field
                        name="name"
                        label={t('The name of the module')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label={t('Introduction of the module')}
                        component={TextField}
                        multiline={true}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                  <div className={classes.ctl}>
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
                  </div>
                </Form>
              )
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModuleForm
