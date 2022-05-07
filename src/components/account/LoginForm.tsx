import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import { Button, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper, Box } from '@mui/material'
import Logo from 'components/layout/Logo'
import { getBGImageUrl } from 'utils/ImageUtils'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import CodeIcon from '@mui/icons-material/Code'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Refresh from '@mui/icons-material/Refresh'
import { login } from 'actions/account'
import URI from 'urijs'
import { push } from 'connected-react-router'
import { getRouter } from 'selectors/router'
import { Link } from '../../family'
import { useSnackbar } from 'notistack'

const { serve } = config

export default function LoginForm() {
  const { t } = useTranslation()
  const [bg] = useState(getBGImageUrl())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const router = useSelector(getRouter)
  const { pathname, hash, search } = router.location
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault()
    if (!email || !password || !captcha) {
      enqueueSnackbar(`请输入账号、密码、验证码`, { variant: 'warning' })
    } else {
      dispatch(
        login({ email, password, captcha }, (isOk, errMsg) => {
          if (isOk) {
            const uri = URI(pathname + hash + search)
            const original = uri.search(true).original as string
            if (original) {
              dispatch(push(decodeURIComponent(original)))
            } else {
              dispatch(push('/'))
            }
          } else {
            enqueueSnackbar(errMsg ?? 'Login failed', { variant: 'error' })
          }
        })
      )
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'absolute', overflow: 'hidden', backgroundSize: 'cover', background: bg }}>
      <Paper sx={{ width: '350px', margin: 'auto', marginTop: '150px', opacity: 0.85 }}>
        <List>
          <form>
            <ListItem>
              <Logo color="#3f51b5" />
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
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end" tabIndex={100}>
                      <IconButton size="large">
                        <PhoneIcon />
                      </IconButton>
                    </InputAdornment>}
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="password">{t('password')}</InputLabel>
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
          </form>
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => setCaptchaId(Date.now())}>
              <Box component="img" src={`${serve}/captcha?t=${captchaId}`} sx={{ width: '108px', height: '36px' }} alt="captcha" />
              <Refresh />
            </Box>
            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => dispatch(push('/account/register'))}>
                {t('Register')}
              </Button>
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>{t('Login')}</Button>
            </Box>
          </ListItem>
          <ListItem sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="#" onClick={() => dispatch(push('/account/findpwd'))} className="operation ">{t('Forgot password?')}</Link>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
