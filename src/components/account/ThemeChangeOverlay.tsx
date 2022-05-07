import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { grey, red, pink, purple, orange, blue, green, cyan, indigo } from '@mui/material/colors'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ThemeOptions, Box } from '@mui/material'
import { SimplePaletteColorOptions } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { changeTheme } from 'actions/account'

export enum THEME_TEMPLATE_KEY {
  INDIGO = 'INDIGO', // DEFAULT
  RED = 'RED',
  BLACK = 'BLACK',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  PINK = 'PINK',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  CYAN = 'CYAN',
}

export const THEME_TEMPLATE_KEY_LIST = [
  THEME_TEMPLATE_KEY.INDIGO,
  THEME_TEMPLATE_KEY.RED,
  THEME_TEMPLATE_KEY.BLACK,
  THEME_TEMPLATE_KEY.BLUE,
  THEME_TEMPLATE_KEY.GREEN,
  THEME_TEMPLATE_KEY.PINK,
  THEME_TEMPLATE_KEY.ORANGE,
  THEME_TEMPLATE_KEY.PURPLE,
  THEME_TEMPLATE_KEY.CYAN,
]

interface Props {
  handleClose: (themeId?: THEME_TEMPLATE_KEY) => void
  open: boolean
  val: THEME_TEMPLATE_KEY
}

function ThemeChangeOverlay(props: Props) {
  const { handleClose, open, val } = props
  const [themeId, setThemeId] = useState(THEME_TEMPLATE_KEY.INDIGO)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const onChange = (themeId: THEME_TEMPLATE_KEY) => {
    setThemeId(themeId)
    dispatch(changeTheme(themeId))
  }
  useEffect(() => {
    setThemeId(val)
  }, [val])
  return (
    <div>
      <Dialog open={open} onClose={() => handleClose()} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('Change the skin')}</DialogTitle>
        <DialogContent>
          <DialogContentText> {t('Please select a favorite skin')} </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {THEME_TEMPLATE_KEY_LIST.map(key => ({ ...THEME_TEMPLATES[key], key })).map(template => (
              <ThemeTemplateOption
                key={template.key}
                ke={template.key}
                selected={template.key === themeId}
                name={t(template.name)}
                color={(template.theme.palette!.primary as SimplePaletteColorOptions).main}
                onChange={onChange}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={() => handleClose(themeId)} color="primary">
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}


export const THEME_TEMPLATES: { [key: string]: { theme: ThemeOptions; name: string } } = {
  [THEME_TEMPLATE_KEY.INDIGO]: {
    name: '沉靛蓝',
    theme: {
      palette: {
        primary: {
          main: indigo[500],
          light: indigo[300],
        },
        secondary: pink,
      },
    },
  },
  [THEME_TEMPLATE_KEY.RED]: {
    name: '火焰红',
    theme: {
      palette: {
        primary: {
          main: red[600],
          light: red[50],
        },
        secondary: {
          main: pink[400],
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.BLACK]: {
    name: '高级黑',
    theme: {
      palette: {
        primary: {
          main: grey[900],
          light: grey[50],
        },
        secondary: {
          main: '#000000',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.BLUE]: {
    name: '忧郁蓝',
    theme: {
      palette: {
        primary: {
          main: '#2196f3',
          light: blue[50],
        },
        secondary: {
          main: '#1769aa',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.GREEN]: {
    name: '原谅绿',
    theme: {
      palette: {
        primary: {
          main: '#357a38',
          light: green[50],
        },
        secondary: {
          main: '#4caf50',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.PINK]: {
    name: '公主粉',
    theme: {
      palette: {
        primary: {
          main: '#ed4b82',
          light: pink[50],
        },
        secondary: {
          main: '#e91e63',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.ORANGE]: {
    name: '动感橙',
    theme: {
      palette: {
        primary: {
          main: '#ff9800',
          light: orange[50],
        },
        secondary: {
          main: '#b26a00',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.PURPLE]: {
    name: '贵族紫',
    theme: {
      palette: {
        primary: {
          main: '#9500ae',
          light: purple[50],
        },
        secondary: {
          main: '#d500f9',
        },
      },
    },
  },
  [THEME_TEMPLATE_KEY.CYAN]: {
    name: '成熟青',
    theme: {
      palette: {
        primary: {
          main: '#14a37f',
          light: cyan[50],
        },
        secondary: {
          main: '#1de9b6',
        },
      },
    },
  },
}

const ThemeTemplateOption = ({ ke, name, color, selected, onChange }:
{ ke: THEME_TEMPLATE_KEY; name: string; color: string; selected: boolean; onChange: (themeId: THEME_TEMPLATE_KEY) => void }) => {
  return (
    <Box
      onClick={() => onChange(ke)}
      sx={{ display: 'flex', flexDirection: 'column', mr: 0.5, ...selected ? { color: '#FFFFFF', backgroundColor: 'primary.main' } : {} }}
    >
      <Box sx={{ width: '50px', height: '50px' }} style={{ backgroundColor: color }}>&nbsp;</Box>
      <Box sx={{ mt: 0.5, textAlign: 'center' }}>{name}</Box>
    </Box>
  )
}

export default ThemeChangeOverlay
