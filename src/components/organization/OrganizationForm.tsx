import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import AsyncSelect from 'components/common/AsyncSelect'
import Transition from 'components/common/Transition'
import { AddMembers } from 'components/repository/RepositoryForm'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { refresh } from '../../actions/common'
import { addOrganization, updateOrganization } from '../../actions/organization'
import { Organization, RootState } from '../../actions/types'
import { FORM, YUP_MSG } from '../../family/UIConst'
import AccountService from '../../relatives/services/Account'
import RadioList from '../utils/RadioList'


const FORM_STATE_INIT: Organization = {
  id: 0,
  name: '',
  description: '',
  members: [],
  visibility: false,
}

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  organization?: Organization
}

function OrganizationForm(props: Props) {
  const { open, onClose, organization } = props
  const auth = useSelector((state: RootState) => state.auth)
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
      <DialogTitle>{t('create team')}</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ minWidth: '500px', minHeight: '300px' }}>
          <Formik
            initialValues={{
              ...FORM_STATE_INIT,
              ...(organization || {}),
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              const addOrUpdateOrganization = values.id ? updateOrganization : addOrganization
              const organization: Organization = {
                ...values,
                memberIds: (values.members || []).map(user => user.id),
              }
              dispatch(addOrUpdateOrganization(organization, () => {
                dispatch(refresh())
                onClose(true)
              }))
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => {
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
                    {values.id > 0 &&
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('The project Owner')}</Box>
                        {organization.owner && (organization.owner.id === auth.id)
                          ? (
                            <AsyncSelect
                              fetcher={ownersFetcher}
                              multiple={false}
                              value={{ label: values?.owner?.fullname || '', value: values?.owner?.id || null }}
                              onChange={selected => {
                                if (selected[0]) {
                                  setFieldValue('owner', selected.map(x => ({ fullname: x.label, id: x.value }))[0])
                                  setFieldValue('ownerId', selected[0].value)
                                }
                              }}
                            />
                          )
                          : <div className="pt7 pl9">{values.owner?.fullname}</div>
                        }
                      </Box>
                    }
                    <Box sx={{ mb: 1 }}>
                      <RadioList
                        data={FORM(t).RADIO_LIST_DATA_VISIBILITY}
                        curVal={values.visibility}
                        name="visibility"
                        onChange={(val: any) => setFieldValue('visibility', val)}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="name"
                        label={t('The name of the team')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Field
                        name="description"
                        label={t('Describe')}
                        component={TextField}
                        fullWidth={true}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('The team members')}</Box>
                      <AsyncSelect
                        fetcher={membersFetcher}
                        multiple={true}
                        value={values.members.map(x => ({ label: x.fullname, value: x.id }))}
                        onChange={selected => { setFieldValue('members', selected.map(x => ({ fullname: x.label, id: x.value }))) }}
                      />
                    </Box>
                  </div>
                  <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" color="primary" className="mr1" disabled={isSubmitting}>{t('submit')}</Button>
                    <Button onClick={() => onClose()} disabled={isSubmitting}>{t('cancel')}</Button>
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

export default OrganizationForm
