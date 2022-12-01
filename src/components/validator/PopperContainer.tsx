import { Button, Grid, Paper, Popper } from '@mui/material'
import { Form, Formik, FormikProps } from 'formik'
import PopupState, { bindPopper, bindToggle, InjectedProps } from 'material-ui-popup-state'
import { useSnackbar } from 'notistack'
import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

interface IPopperContainerProps {
  trigger: (triggerProps: ReturnType<typeof bindToggle>) => JSX.Element
  isMountedParent?: boolean
  children?: JSX.Element | ((popperProps: InjectedProps) => JSX.Element)
}
export default function PopperContainer(props: IPopperContainerProps) {
  const { trigger, children, isMountedParent = true } = props

  return (
    <PopupState variant="popper" >
      {(popupState) => (
        <>
          {/* trigger Element */}
          {trigger && trigger(bindToggle(popupState))}

          {/* popper & form */}
          <Popper {...bindPopper(popupState)}
            placement="bottom-end"
            disablePortal={isMountedParent}
            modifiers={[
              {
                name: 'arrow',
                enabled: true,
                options: {
                  // element: arrowRef,
                },
              },
            ]}
            style={{
              zIndex: isMountedParent ? 999 : 9999,
            }}
          >
            <Paper elevation={3}>
              {/* Form Element */}
              {typeof children === 'function' ? children(popupState) : children}
            </Paper>
          </Popper>
        </>
      )}
    </PopupState>
  )
}

const DefaultFormStyle: Partial<CSSProperties> = {
  minWidth: '200px',
  minHeight: '80px',
  padding: '10px',
}

interface IPopperFormProps<Values> {
  initialValues: Values
  fields: (values: Values, formik: FormikProps<Values>) => JSX.Element[]
  onSubmit: (values: Values) => Promise<boolean> | boolean
  onClose?: () => void
  style?: Partial<CSSProperties>
}
export function PopperForm<Values>(props: IPopperFormProps<Values>) {
  const { initialValues, fields, onSubmit, onClose, style } = props

  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Formik<Values>
      initialValues={initialValues}
      onSubmit={async (values) => {
        if (onSubmit) {
          try {
            const success = await onSubmit(values)
            if (!success) {
              return
            }
          } catch (e) {
            enqueueSnackbar(`Form data submit error:${e.message}`, { variant: 'error' })
          }
        }
        onClose && onClose()
      }}
      onReset={() => {
        onClose && onClose()
      }}
    >
      {(formik) => (
        <Form className='PopperForm' onSubmit={formik.handleSubmit} onChange={formik.handleChange} onReset={formik.handleReset}
          style={style ? { ...DefaultFormStyle, ...style } : DefaultFormStyle}>
          <Grid container={true}>
            {fields?.(formik.values, formik)?.map((filed, index) => (
              <Grid key={index} item={true} xs={12} >
                {filed}
              </Grid>
            ))}
            <Grid item={true} xs={12} style={{ display: 'inline-flex', justifyContent: 'flex-end' }}>
              <Button type='reset' size="small">{t('cancel')}</Button>
              <Button type='submit' size="small" color="primary">{t('confirm')}</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik >
  )
}
