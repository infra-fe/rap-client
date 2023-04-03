import { useTranslation } from 'react-i18next'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Transition from 'components/common/Transition'

interface Props {
  open: boolean
  title?: string
  content: React.ReactNode
  type: 'alert' | 'confirm'
  onConfirm: () => void
  onCancel: () => void
}
export default function ConfirmDialog(props: Props) {
  const {t} = useTranslation()
  const { type, title = t('Confirm') } = props
  return (
    <Dialog open={props.open} onClose={props.onCancel} TransitionComponent={Transition}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{fontSize: '14px'}}>
        {props.content}
      </DialogContent>
      <DialogActions>
        {type === 'confirm' && (
          <Button onClick={props.onCancel} variant="outlined">
            {t('cancel')}
          </Button>
        )}
        <Button onClick={props.onConfirm} variant="contained" color="primary" autoFocus={true}>
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
