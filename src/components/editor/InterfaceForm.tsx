import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material'
import Transition from 'components/common/Transition'
import { push, StoreStateRouterLocationURI } from 'family'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { addInterface, updateInterface } from '../../actions/interface'
import { Interface, Module, Repository, RootState } from '../../actions/types'
import { YUP_MSG } from '../../family/UIConst'
import InterfaceTagSelect from './InterfaceTagSelect'
export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']
export const STATUS_LIST = [200, 201, 301, 403, 404, 500, 502, 503, 504]


interface FormState extends Interface {
  useTmpl?: boolean
}

const FORM_STATE_INIT: FormState = {
  id: 0,
  name: '',
  url: '',
  method: 'GET',
  description: '',
  repositoryId: 0,
  moduleId: 0,
  status: 200,
  useTmpl: false,
}

interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  itf?: Interface
  repository?: Repository
  mod?: Module
  type?: 'create' | 'edit'
}
const PREFER_METHOD = 'PreferMethod'

function InterfaceForm(props: Props) {
  const isEdit = props.type === 'edit'
  const auth = useSelector((state: RootState) => state.auth)
  const { open, onClose, itf, title, repository, mod } = props
  const checkPrefer = !isEdit && open
  const dispatch = useDispatch()
  const router = useSelector((state: RootState) => state.router)
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const repo = useSelector((state: RootState) => state.repository.data)
  const tmpls = useMemo(() => repo.modules.map(x => x.interfaces)
    .reduceRight((a, b) => [...a, ...b], []).filter(x => x.isTmpl), [repo])

  const schema = Yup.object().shape({
    name: Yup.string().required(msg.REQUIRED).max(40, msg.MAX_LENGTH(40)),
    url: Yup.string().required(msg.REQUIRED).matches(/^(\/|https:|http:)/, t('msg3')),
    description: Yup.string().max(1000, msg.MAX_LENGTH(1000)),
  })
  const initialState = { ...FORM_STATE_INIT }
  const preferMethod = localStorage.getItem(PREFER_METHOD)
  if (checkPrefer) {
    if (preferMethod && preferMethod !== 'GET') {
      initialState.method = preferMethod
    }
  }

  // Tag选择器
  const [tagIds, setTagIds] = useState<number[]>([])
  const handleTagChange = (tagIds: number[]) => {
    setTagIds(tagIds || [])
  }

  useEffect(() => {
    const tagIds = itf?.tagIds || itf?.tags?.map?.(tag => tag.id) || []
    setTagIds(tagIds)
  }, [itf?.tagIds, itf?.tags])

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ minWidth: '500px', minHeight: '300px' }}>
          <Formik
            initialValues={{
              ...initialState,
              ...(itf || {}),
            }}
            validationSchema={schema}
            onSubmit={values => {
              const addOrUpdateInterface = values.id
                ? updateInterface
                : addInterface
              const itf: Interface = {
                ...values,
                tagIds,
                creatorId: auth.id,
                repositoryId: repository!.id,
                moduleId: mod!.id,
              }
              if (checkPrefer && preferMethod !== values.method) {
                localStorage.setItem(PREFER_METHOD, values.method)
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
          >
            {({ isSubmitting, setFieldValue, values }) => {
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
                      <Field
                        name="url"
                        label={t('URL address')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <FormControl>
                        <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                          {t('Method')}
                        </div>
                        <Select
                          value={values.method}
                          displayEmpty={true}
                          name="method"
                          style={{ width: 200 }}
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
                    </Box>
                    <Box sx={{ mb: 1 }}>
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
                        style={{ width: 200 }}
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
                    </Box>
                    {!isEdit && <Box sx={{ mb: 1 }}>
                      <InputLabel
                        shrink={true}
                        htmlFor="method-label-placeholder"
                      >
                        {t('From tmpl')}
                      </InputLabel>
                      <Switch
                        value={values.useTmpl}
                        onChange={e => setFieldValue('useTmpl', e.target.checked)}
                      />
                    </Box>}
                    {!isEdit && values.useTmpl &&
                      <Box sx={{ mb: 1 }}>
                        <InputLabel
                          shrink={true}
                          htmlFor="method-label-placeholder"
                        >
                          {t('Select tmpl')}
                        </InputLabel>
                        <Select
                          value={values.tmplId ?? 0}
                          displayEmpty={true}
                          name="tmplId"
                          style={{ width: '100%', maxWidth: '500px' }}
                          disabled={tmpls.length === 0}
                          onChange={selected => {
                            setFieldValue('tmplId', selected.target.value)
                          }}
                        >
                          {tmpls.map(tmpl => (
                            <MenuItem key={tmpl.id} value={tmpl.id}>
                              <Typography variant="inherit" noWrap={true} style={{ maxWidth: '480px' }}>
                                {tmpl.name}: {tmpl.url}
                              </Typography>
                            </MenuItem>
                          ))}
                          {<MenuItem value={0}>{t(tmpls.length === 0 ? 'No tmpl' : 'Select')}</MenuItem>}
                        </Select>
                      </Box>
                    }
                    <Box sx={{ mb: 1, mt: 1 }}>
                      <InterfaceTagSelect title={t('Add')} canUserEdit={repository?.canUserEdit}
                        repositoryId={repository?.id} tagIds={tagIds} onChange={handleTagChange} />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="description"
                        label={t('Instructions')}
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
                    <Button onClick={() => onClose()} disabled={isSubmitting} sx={{ ml: 1 }}>
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

export default InterfaceForm
