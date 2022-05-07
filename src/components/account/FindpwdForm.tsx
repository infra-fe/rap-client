import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import config from '../../config'
import { Button, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper, Box } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import CodeIcon from '@mui/icons-material/Code'
import Refresh from '@mui/icons-material/Refresh'
import { findpwd } from 'actions/account'
import { push } from 'connected-react-router'
import { useSnackbar } from 'notistack'

const { serve } = config

export default function FindpwdForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault()
    if (!email || !captcha) {
      enqueueSnackbar(`请输入Email、验证码`, { variant: 'warning' })
    } else {
      dispatch(
        findpwd({ email, captcha }, () => {
          enqueueSnackbar(`发送成功，请登录您的邮箱按提示重置密码`, { variant: 'success' })
        })
      )
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'absolute', overflow: 'hidden', backgroundSize: 'cover' }}>
      <Paper sx={{ width: 350, margin: 'auto', marginTop: 150, opacity: 0.85 }}>
        <List>
          <ListItem>
            <h2>{t('Email to reset the password')}</h2>
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="email">{t('email')}</InputLabel>
              <Input
                tabIndex={0}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                autoFocus={true}
                required={true}
                endAdornment={
                  <InputAdornment position="end" tabIndex={100}>
                    <IconButton size="large">
                      <EmailIcon />
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
            <Box sx={{ cursor: 'pointer' }} onClick={() => setCaptchaId(Date.now())}>
              <Box component="img" src={`${serve}/captcha?t=${captchaId}`} sx={{ width: 108, height: 36 }} alt="captcha" />
              <Refresh />
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => dispatch(push('/account/login'))}>
                {t('cancel')}
              </Button>
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>{t('send')}</Button>
            </Box>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
