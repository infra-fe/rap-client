import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Select } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { Repository, RepositoryFormData, RootState } from '../../actions/types'
import AsyncSelect from 'components/common/AsyncSelect'
import Transition from 'components/common/Transition'
import _ from 'lodash'
import { refresh } from '../../actions/common'
import { fetchJoinedOrganizationList, fetchOwnedOrganizationList } from '../../actions/organization'
import { addRepository, updateRepository } from '../../actions/repository'
import AccountService from '../../relatives/services/Account'
import RadioList from '../utils/RadioList'
import { FORM, YUP_MSG } from '../../family/UIConst'

export function AddMembers(users, members) {
  members.forEach(value => {
    const user = users.find(user => user.id === value.id)
    if (user) {
      user.email = value.email
      user.fullname = value.fullname
    } else {
      users.push(value)
    }
  })
}

const formTitleSX = {
  color: 'rgba(0, 0, 0, 0.54)',
  fontSize: 9,
}


const FORM_STATE_INIT: RepositoryFormData = {
  id: 0,
  name: '',
  basePath: '',
  description: '',
  members: [],
  organizationId: undefined,
  collaborators: [],
  collaboratorIdstring: '',
  visibility: true,
}
interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  repository?: Repository
  organizationId?: number
}

function RepositoryForm(props: Props) {
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    name: Yup.string()
      .required(msg.REQUIRED)
      .max(40, msg.MAX_LENGTH(40)),
    description: Yup.string().max(1000, msg.MAX_LENGTH(1000)),
    basePath: Yup.string().nullable().matches(/^(\/|(https|http):\/\/)/, t('basePath is incorrect')),
  })
  const { open, onClose, title, organizationId } = props
  let repository = props.repository as RepositoryFormData
  if (repository) {
    repository.collaboratorIdstring = repository.collaborators!.map(x => { return x.id }).join(',')
  }
  const auth = useSelector((state: RootState) => state.auth)
  const organizations = useSelector((state: RootState) => {
    return _.uniqBy([...state.ownedOrganizations.data, ...state.joinedOrganizations.data], 'id')
  }).map(org => ({
    label: org.name,
    value: org.id,
    visibility: org.visibility,
  }))

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchJoinedOrganizationList())
    dispatch(fetchOwnedOrganizationList())
  }, [dispatch])

  if (repository) {
    repository = { ...FORM_STATE_INIT, ...repository }
    repository.collaboratorIdstring = repository
      .collaborators!.map(x => {
      return x.id
    })
      .join(',')
  } else {
    repository = { ...FORM_STATE_INIT }
    if (organizationId !== undefined) {
      repository.organizationId = organizationId
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ minWidth: 500 }}>
          <Formik
            initialValues={repository}
            validationSchema={schema}
            onSubmit={values => {
              const addOrUpdateRepository = values.id ? updateRepository : addRepository
              const repository: RepositoryFormData = {
                ...values,
                memberIds: (values.members || []).map(user => user.id),
                collaboratorIds: (values.collaboratorIdstring || '').split(','),
              }
              const { owner, newOwner } = values
              if (newOwner && newOwner.id !== owner!.id) {
                repository.ownerId = newOwner.id
              }
              dispatch(
                addOrUpdateRepository(repository, () => {
                  dispatch(refresh())
                  onClose(true)
                })
              )
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => {
              const isShowRepositoryVisibility = organizations.find(item=>item.value === values.organizationId)?.visibility
              const membersFetcher = async (query: string) => {
                const users = (await AccountService.fetchUserList({ name: query })).data
                if (values.members) {
                  AddMembers(users, values.members)
                }
                return users.map(x => ({ label: `${x.fullname} ${x.empId || x.email}`, value: x.id }))
              }
              const ownersFetcher = async (query: string) => {
                const users = (await AccountService.fetchUserList({ name: query })).data
                if (values.owner) {
                  AddMembers(users, [values.owner])
                }
                return users.map(x => ({ label: `${x.fullname} ${x.empId || x.email}`, value: x.id }))
              }
              return (
                <Form>
                  <div className="rmodal-body">
                    {values.id > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('The owner')}</Box>

                        {values.owner && values.owner.id === auth.id ? (
                          <AsyncSelect
                            multiple={false}
                            fetcher={ownersFetcher}
                            value={values.newOwner ?
                              { label: values?.newOwner?.fullname || '', value: values?.newOwner?.id || null }
                              : { label: values?.owner?.fullname || '', value: values?.owner?.id || null }}
                            onChange={selected => {
                              if (selected[0]) {
                                setFieldValue('newOwner', selected.map(x => ({ fullname: x.label, id: x.value }))[0])
                              }
                            }}
                          />
                        ) : (
                          <div className="pt7 pl9">{values.owner!.fullname}</div>
                        )}
                      </Box>
                    )}
                    <Box sx={{ mb: 1 }}>
                      <Field name="name" label={t('The name of the repository')} component={TextField} fullWidth={true} />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field name="basePath" label={t('BasePath')} component={TextField} fullWidth={true} />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="description"
                        label={t('Description (multiple lines, supporting the Markdown)')}
                        multiline={true}
                        component={TextField}
                        fullWidth={true}
                        maxRows={8}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={formTitleSX}>{t('Members')}</Box>
                      <AsyncSelect
                        multiple={true}
                        fetcher={membersFetcher}
                        value={values.members!.map(x => ({ label: x.fullname, value: x.id }))}
                        onChange={selected => setFieldValue('members', selected.map(x => ({ fullname: x.label, id: x.value })))}
                      />
                    </Box>
                    {organizations.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Box sx={formTitleSX}>{t('Organization')}</Box>
                        <Select
                          value={values.organizationId}
                          sx={{ width: 500 }}
                          onChange={e => {
                            setFieldValue('organizationId', e.target.value)
                          }}
                        >
                          {organizations.map(option => (
                            <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                    {isShowRepositoryVisibility && (<>
                      <Box sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>{t('Visibility')}:</Box>
                      <Box sx={{ mb: 1 }}>
                        <RadioList
                          data={FORM(t).RADIO_LIST_DATA_VISIBILITY}
                          curVal={values.visibility}
                          name="visibility"
                          onChange={(val: any) => setFieldValue('visibility', val)}
                        />
                      </Box></>)}
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="collaboratorIdstring"
                        label={t('Collaborative repository ID')}
                        component={TextField}
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
                    <Button onClick={() => onClose()} disabled={isSubmitting}>
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

export default RepositoryForm
