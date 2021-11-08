import { useTranslation } from 'react-i18next'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { Interface, Repository, RootState, Module } from '../../actions/types'
import { updateInterface, addInterface } from '../../actions/interface'
import { StoreStateRouterLocationURI, push } from 'family'
export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']
export const STATUS_LIST = [200, 301, 403, 404, 500, 502, 503, 504]

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
    minHeight: 300,
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

const FORM_STATE_INIT: Interface = {
  id: 0,
  name: '',
  url: '',
  method: 'GET',
  description: '',
  repositoryId: 0,
  moduleId: 0,
  status: 200,
}

interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  itf?: Interface
  repository?: Repository
  mod?: Module
}

function InterfaceForm(props: Props) {
  const auth = useSelector((state: RootState) => state.auth)
  const { open, onClose, itf, title, repository, mod } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useSelector((state: RootState) => state.router)
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
              ...(itf || {}),
            }}
            validationSchema={schema}
            onSubmit={values => {
              const addOrUpdateInterface = values.id
                ? updateInterface
                : addInterface
              const itf: Interface = {
                ...values,
                creatorId: auth.id,
                repositoryId: repository!.id,
                moduleId: mod!.id,
              }
              dispatch(
                addOrUpdateInterface(itf, (e) => {
                  if (e && e.id) {
                    const href = StoreStateRouterLocationURI(router)
                      .setSearch('itf', e.id)
                      .href()
                    dispatch(push(href))
                  }
                  onClose(true)
                })
              )
            }}
            render={({ isSubmitting, setFieldValue, values }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <div className={classes.formItem}>
                      <Field
                        name="name"
                        label={t('Name')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="url"
                        label={t('URL address')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <FormControl>
                        <InputLabel
                          shrink={true}
                          htmlFor="method-label-placeholder"
                        >
                          {t('Type')}
                        </InputLabel>
                        <Select
                          value={values.method}
                          displayEmpty={true}
                          name="method"
                          onChange={selected => {
                            setFieldValue('method', selected.target.value)
                          }}
                        >
                          {METHODS.map(method => (
                            <MenuItem key={method} value={method}>
                              {method}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.formItem}>
                      <InputLabel
                        shrink={true}
                        htmlFor="method-label-placeholder"
                      >
                        {t('Status code')}
                      </InputLabel>
                      <Select
                        value={values.status}
                        displayEmpty={true}
                        name="status"
                        onChange={selected => {
                          setFieldValue('status', selected.target.value)
                        }}
                      >
                        {STATUS_LIST.map(status => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label={t('Instructions')}
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
                    <Button onClick={() => onClose()} disabled={isSubmitting}>
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

export default InterfaceForm
