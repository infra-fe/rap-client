import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import { green } from '@mui/material/colors'

interface Props extends ButtonProps {
  label: string
}

export default React.forwardRef((props: Props, ref: any) => {
  const { children, label, ...rest } = props
  const loading = props.disabled
  return (
    <Box sx={{ position: 'relative', display: 'inline' }} ref={ref}>
      <Button {...rest}>
        {loading ? '处理中...' : label}
        {children}
      </Button>
      {loading && <CircularProgress size={24} sx={{ color: green[500], position: 'absolute', top: '50%', left: '50%', mt: -1.5, ml: -1.5 }} />}
    </Box>
  )
})
