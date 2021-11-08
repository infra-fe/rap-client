import { useTranslation } from 'react-i18next'
import React, {useEffect, useState} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Link } from 'react-router-dom'
import { User } from 'actions/types'
import Logo from './Logo'
import { push, moment, MOMENT_LOCALE } from '../../family'
import { useDispatch } from 'react-redux'
import { logout } from 'actions/account'
import i18n, {resources} from '../../i18n'

const getLangPrefix = (language: string) => language.substring(0, 2)
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      color: '#FFFFFF',
      '&:hover': {
        color: '#FFFFFF',
      },
      textTransform: 'none',
    },
    right: {
      float: 'right',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      '& :not(.logo)': {
        fontSize: '1.2rem',
      },
    },
    links: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      display: 'block',
      marginRight: theme.spacing(2),
      padding: `${theme.spacing(1.5)}px  0 ${theme.spacing(1.5)}px 0`,
    },
    accountName: {
      color: '#FFFFFF',
    },
  })
)
function I18nButton() {
  const [i18nOpen, setI18nOpen] = React.useState(false)
  const i18nRef = React.useRef<HTMLButtonElement>(null)
  const [language,setLanguage] = useState('en')
  const classes = useStyles()
  useEffect(() => {
    const type = localStorage.getItem('i18nextLng')
    if(type) {
      setLanguage(getLangPrefix(type))
    }
  }, [])
  const handleI18nToggle = () => {
    setI18nOpen(prevOpen => !prevOpen)
  }
  const handleI18nClose = (event: React.MouseEvent<Document, MouseEvent>) => {

    if (i18nRef && i18nRef.current && event.target instanceof Node && i18nRef.current.contains(event.target)) {
      return
    }

    setI18nOpen(false)
  }
  const handleI18nClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
    setLanguage(key)
    i18n.changeLanguage(getLangPrefix(key))
    moment.locale(MOMENT_LOCALE[key])
    setI18nOpen(false)
  }
  return (
    <div style={{display: 'inline-block'}}>
      <Button
        color="inherit"
        aria-haspopup="true"
        onClick={handleI18nToggle}
        ref={i18nRef}
      >
        <span className={`mr1 ${classes.accountName}`}>
          {resources[language]?.name}
          <ExpandMoreIcon fontSize="small" style={{ color: '#FFFFFF' }} />
        </span>
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
              <ClickAwayListener onClickAway={handleI18nClose}>
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
  const classes = useStyles()
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

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {

    if (anchorRef && anchorRef.current && event.target instanceof Node && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <I18nButton/>
      <Button
        color="inherit"
        aria-haspopup="true"
        aria-label={t('account')}
        onClick={handleToggle}
        ref={anchorRef}
      >
        <span className={`mr1 ${classes.accountName} guide-3`}>
          {user.fullname}
          <ExpandMoreIcon fontSize="small" style={{ color: '#FFFFFF' }} />
        </span>
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
              <ClickAwayListener onClickAway={handleClose}>
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
    </div>
  )
}


interface Props {
  user: User
}

export default function MainMenu(props: Props) {
  const { user } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar} variant="dense">
          <div className={classes.links}>
            <Link to="/" className={classes.logo}><Logo /> </Link>
            <Button className={classes.link} onClick={() => dispatch(push('/'))}>{t('Home')}</Button>
            <Button className={classes.link} onClick={() => dispatch(push('/repository/joined'))}>{t('Repository')}</Button>
            <Button className={classes.link} onClick={() => dispatch(push('/organization/joined'))}>{t('Organization')}</Button>
            <Button className={classes.link} onClick={() => dispatch(push('/api'))}>{t('API')}</Button>
            <Button className={classes.link} onClick={() => dispatch(push('/status'))}>{t('Status')}</Button>
            <Button className={classes.link} onClick={() => dispatch(push('/about'))}>{t('About')}</Button>
            <Button
              className={classes.link}
              onClick={() => window.open('https://github.com/thx/rap2-delos/issues/new/choose')}
              color="inherit"
            >
              {t('Feedback')}
            </Button>
          </div>
          <AccountButton user={user} />
        </Toolbar>
      </AppBar>
    </div>
  )
}
