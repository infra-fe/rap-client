import {
  Close,
  Fullscreen,
  FullscreenExit,
  HelpOutlineOutlined,
} from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import MainContent from './MainContent'

import './Validator.sass'

// 类型定义
import { useState } from 'react'
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

  /**
     * 控制全屏
     */
  const [isFullscreen, setFullscreen] = useState(false)
  const handleFullscreen = () => {
    setFullscreen(!isFullscreen)
  }

  return (
    <Dialog
      fullScreen={isFullscreen}
      fullWidth={true}
      maxWidth="lg"
      open={open}
      scroll="paper"
      aria-labelledby="max-width-dialog-title"
    >
      {/* 标题区域 */}
      <DialogTitle>
        {t('Interface Validation')}
        <span
          style={{
            fontSize: '12px',
            verticalAlign: 'super',
            color: 'red',
            padding: '0 5px',
          }}
        >
                    beta
        </span>
        <a
          href="https://github.com/infra-fe/rap-client/wiki/Interface-Validate-%E6%8E%A5%E5%8F%A3%E6%A0%A1%E9%AA%8C"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HelpOutlineOutlined />
        </a>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ float: 'right' }}
          size="large"
        >
          <Close />
        </IconButton>
        <IconButton
          aria-label="fullscreen"
          onClick={handleFullscreen}
          style={{ float: 'right' }}
          size="large"
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
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
