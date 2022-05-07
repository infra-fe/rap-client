import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import { User } from 'actions/types'
import Logo from './Logo'
import { push, moment, MOMENT_LOCALE } from '../../family'
import { useDispatch } from 'react-redux'
import { logout } from 'actions/account'
import i18n, { resources } from '../../i18n'
import { Box } from '@mui/material'

const getLangPrefix = (language: string) => language.substring(0, 2)

function I18nButton() {
  const [i18nOpen, setI18nOpen] = React.useState(false)
  const i18nRef = React.useRef<HTMLButtonElement>(null)
  const [language, setLanguage] = useState('en')
  useEffect(() => {
    const type = localStorage.getItem('i18nextLng')
    if (type) {
      setLanguage(getLangPrefix(type))
    }
  }, [])
  const handleI18nToggle = () => {
    setI18nOpen(prevOpen => !prevOpen)
  }
  const handleI18nClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
    setLanguage(key)
    i18n.changeLanguage(getLangPrefix(key))
    moment.locale(MOMENT_LOCALE[key])
    setI18nOpen(false)
  }
  return (
    <div style={{ display: 'inline-block' }}>
      <Button
        color="inherit"
        aria-haspopup="true"
        onClick={handleI18nToggle}
        ref={i18nRef}
      >
        <Box component="span" sx={{ color: '#FFFFFF' }}>
          {resources[language]?.name}
          <ExpandMoreIcon fontSize="small" style={{ color: '#FFFFFF' }} />
        </Box>
      </Button>
      <Popper open={i18nOpen} anchorEl={i18nRef.current} role={undefined} transition={true}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={e => {
                if (i18nRef && i18nRef.current && e.target instanceof Node && i18nRef.current.contains(e.target)) {
                  return
                }
                setI18nOpen(false)
              }}>
                <MenuList>
                  {Object.keys(resources).map(key => (
                    <MenuItem key={key} onClick={(event) => handleI18nClick(event, key)}>
                      {resources[key].name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
function AccountButton({ user }: { user: User }) {
  const { t } = useTranslation()
  const options = [{
    key: 'myAccount',
    text: t('My Account'),
  }, {
    key: 'preferences',
    text: t('Preferences'),
  }, {
    key: 'logout',
    text: t('Logout'),
  }]
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const dispatch = useDispatch()


  const handleMenuItemClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
    if (key === 'logout') {
      dispatch(logout())
    } else if (key === 'preferences') {
      dispatch(push('/preferences'))
    } else if (key === 'myAccount') {
      dispatch(push('/account/myAccount'))
    }
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <Box sx={{ display: 'inline-block' }}>
      <I18nButton />
      <Button
        color="inherit"
        aria-haspopup="true"
        aria-label={t('account')}
        onClick={handleToggle}
        ref={anchorRef}
      >
        <Box component="span" sx={{ color: '#FFFFFF' }} className={`mr1 guide-3`}>
          {user.fullname}
          <ExpandMoreIcon fontSize="small" style={{ color: '#FFFFFF' }} />
        </Box>
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition={true}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={e => {
                if (anchorRef && anchorRef.current && e.target instanceof Node && anchorRef.current.contains(e.target)) {
                  return
                }
                setOpen(false)
              }}>
                <MenuList id="split-button-menu">
                  {options.map(({ key, text }) => (
                    <MenuItem key={key} onClick={(event) => handleMenuItemClick(event, key)}>
                      {text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}


interface Props {
  user: User
}

export default function MainMenu(props: Props) {
  const { user } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <AppBar position="static" id="appBar">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', '& :not(.logo)': { fontSize: '1.2rem' } }} variant="dense">
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'inline-block'}}>
              <Box component={Link} to="/"><Logo /></Box>
              <Button color="inherit" onClick={() => dispatch(push('/'))}>{t('Home')}</Button>
              <Button color="inherit" onClick={() => dispatch(push('/repository/joined'))}>{t('Repository')}</Button>
              <Button color="inherit" onClick={() => dispatch(push('/organization/joined'))}>{t('Organization')}</Button>
              <Button color="inherit" onClick={() => dispatch(push('/api'))}>{t('API')}</Button>
              <Button color="inherit" onClick={() => dispatch(push('/status'))}>{t('Status')}</Button>
              <Button color="inherit" onClick={() => dispatch(push('/about'))}>{t('About')}</Button>
              <Button onClick={() => window.open('https://github.com/infra-fe/rap-client/issues', '_blank')} color="inherit" > {t('Feedback')} </Button>
              <Button color="inherit" onClick={() => {
                const isChinese = localStorage.getItem('i18nextLng').startsWith('zh')
                window.open(`https://infra-fe.github.io/rap-client/${isChinese ? 'zh-CN' : ''}`, '_blank')}
              }>
                {t('Document')}
              </Button>
            </Box>
            <AccountButton user={user} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
