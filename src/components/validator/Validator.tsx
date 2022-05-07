import { useTranslation } from 'react-i18next'
import {
  Dialog, DialogContent, DialogTitle,
  DialogActions, IconButton,
} from '@mui/material'
import { Close, HelpOutlineOutlined } from '@mui/icons-material'
import MainContent from './MainContent'

import './Validator.css'

// 类型定义
import { ValidatorProps } from './types'

export default function Validator(props: ValidatorProps) {
  const { t } = useTranslation()
  const { open, onClose } = props
  /**
   * 弹窗显隐藏控制
   */
  const handleClose = () => {
    onClose && onClose()
  }

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={open} scroll="paper" aria-labelledby="max-width-dialog-title">
      {/* 标题区域 */}
      <DialogTitle >
        {t('Interface Validation')}
        <span style={{ fontSize: '12px', verticalAlign: 'super', color: 'red', padding: '0 5px' }}>beta</span>
        <a href="https://github.com/infra-fe/rap-client/wiki/Interface-Validate-%E6%8E%A5%E5%8F%A3%E6%A0%A1%E9%AA%8C"
          target="_blank" rel="noopener noreferrer">
          <HelpOutlineOutlined />
        </a>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ float: 'right' }}
          size="large">
          <Close />
        </IconButton>
      </DialogTitle>
      {/* 操作区域 */}
      <DialogContent dividers={true}>
        <MainContent {...props} />
      </DialogContent>
      {/* 没有内容，就是一条线 */}
      <DialogActions />
    </Dialog>
  )
}
