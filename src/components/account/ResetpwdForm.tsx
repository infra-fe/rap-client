import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import { Button, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper, Box } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import Refresh from '@mui/icons-material/Refresh'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { resetpwd } from 'actions/account'
import CodeIcon from '@mui/icons-material/Code'
import { getRouter } from 'selectors/router'
import { push } from 'connected-react-router'
import URI from 'urijs'
import { useSnackbar } from 'notistack'

const { serve } = config

export default function ResetpwdForm() {
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const router = useSelector(getRouter)
  const { pathname, hash, search } = router.location
  const uri = URI(pathname + hash + search)
  const email = uri.search(true).email
  const code = uri.search(true).code
  const token = uri.search(true).token
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault()
    if (!password) {
      enqueueSnackbar(`请输入密码`, { variant: 'warning' })
    } else if (password.length < 6) {
      enqueueSnackbar(`密码长度过短，请输入六位以上密码`, { variant: 'warning' })
    } else {
      dispatch(
        resetpwd({ email, code, token, password, captcha }, () => {
          enqueueSnackbar(`密码重置成功，请重新登录`, { variant: 'success' })
          dispatch(push('/'))
        })
      )
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'absolute', overflow: 'hidden', backgroundSize: 'cover' }}>
      <Paper sx={{ width: '350px', margin: 'auto', marginTop: '150px', opacity: 0.85 }}>
        <List>
          <ListItem>
            <h2>{t('To reset your account password')}</h2>
          </ListItem>
          <ListItem>
            {email}
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="password">{t('To reset your password')}</InputLabel>
              <Input
                tabIndex={1}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end" tabIndex={101}>
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      size="large">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="captcha">{t('Verification code')}</InputLabel>
              <Input
                tabIndex={2}
                name="captcha"
                value={captcha}
                autoComplete="off"
                onKeyDown={e => e.keyCode === 13 && handleSubmit()}
                onChange={e => setCaptcha(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton size="large">
                      <CodeIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ pointer: 'cursor' }} onClick={() => setCaptchaId(Date.now())}>
              <Box component="img" src={`${serve}/captcha?t=${captchaId}`} sx={{ width: '108px', height: '36px' }} alt="captcha" />
              <Refresh />
            </Box>
            <div>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => dispatch(push('/account/login'))}>
                {t('cancel')}
              </Button>
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>{t('To reset your password')}</Button>
            </div>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
