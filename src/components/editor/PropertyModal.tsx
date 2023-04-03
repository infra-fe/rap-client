import { useTranslation } from 'react-i18next'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize } from '@mui/material'
import { useEffect, useState } from 'react'

export interface PropertyModalProps {
  title?: string
  placeholder?: string
  initialValues?: string
  onClose?: () => void
  onConfirm?: (v?: string) => void
  open?: boolean
}
const PropertyModal = (props: PropertyModalProps) => {
  const { initialValues, onClose, onConfirm, open, placeholder, title } = props
  const {t} = useTranslation()
  const [ value, setValue ] = useState<string>(initialValues || '')
  const handleClose = () => {
    onClose()
  }
  const handleConfirm = () => {
    onConfirm(value)
    onClose()
  }
  useEffect(() => {
    setValue(initialValues)
  }, [initialValues])
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      title={title}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={10}
          placeholder={placeholder}
          style={{ width: 500, padding: 15, maxWidth: 500 }}
          defaultValue={initialValues}
          onChange={(e) => {setValue(e.target.value)}}
        />
      </DialogContent>
      <DialogActions style={{paddingBottom: 20}}>
        <Button onClick={() => handleClose()} variant="contained">
          {t('cancel')}
        </Button>
        <Button onClick={() => handleConfirm()} color="primary" variant="contained">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default PropertyModal
