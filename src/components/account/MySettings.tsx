import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material'
import Settings from '@mui/icons-material/Settings'
import Palette from '@mui/icons-material/Palette'
import ThemeChangeOverlay, { THEME_TEMPLATE_KEY } from './ThemeChangeOverlay'
import { CACHE_KEY } from 'utils/consts'

interface Props {
  isFetching: boolean
  data: { [key: string]: string }
  onChange: (key: CACHE_KEY, val: string) => void
}

function MySettings(props: Props) {
  const { data, onChange, isFetching } = props
  const [editingThemeTemplate, setEditingThemeTemplate] = useState(false)
  const { t } = useTranslation()
  const themeId = data[CACHE_KEY.THEME_ID] as THEME_TEMPLATE_KEY || THEME_TEMPLATE_KEY.RED

  const handleClose = (themeId?: THEME_TEMPLATE_KEY) => {
    setEditingThemeTemplate(false)
    themeId && onChange(CACHE_KEY.THEME_ID, themeId)
  }

  return (
    <Paper sx={{ p: 1, maxWidth: '400px' }}>
      <List subheader={<ListSubheader>{t('Preferences')}</ListSubheader>}>
        <ListItem>
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText primary={t('Skin Settings')} />
          <ListItemSecondaryAction>
            <IconButton
              disabled={isFetching}
              onClick={() => setEditingThemeTemplate(true)}
              size="large">
              <Settings />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <ThemeChangeOverlay
        val={themeId}
        open={editingThemeTemplate}
        handleClose={handleClose}
      />
    </Paper>
  )
}

export default MySettings
