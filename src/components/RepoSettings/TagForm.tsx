/*
 * @Author: xia xian
 * @Date: 2022-08-24 14:19:27
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-24 15:07:54
 * @Description:
 */
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Transition from 'components/common/Transition'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { YUP_MSG } from '../../family/UIConst'

interface Props {
  title?: string
  open: boolean
  onClose: (name?: string) => void
  repositoryId?: number
}

function TagForm(props: Props) {
  const { open, onClose, title } = props
  const { t } = useTranslation()
  const msg = YUP_MSG(t)
  const schema = Yup.object().shape({
    name: Yup.string().required(msg.REQUIRED).max(40, msg.MAX_LENGTH(40)),
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
              ...{ name: ''},
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              onClose(values.name)
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

export default TagForm
