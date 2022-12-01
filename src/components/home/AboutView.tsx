import Markdown from 'markdown-to-jsx'
import { Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'

function AboutView() {
  const { t } = useTranslation()
  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Markdown>{t('aboutView')}</Markdown>
    </Paper>
  )
}

export default AboutView
