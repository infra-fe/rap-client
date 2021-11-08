import { useTranslation } from 'react-i18next'
import React from 'react'

function NoData() {
  const { t } = useTranslation()
  return (
    <div style={{ padding: 16, fontSize: 18 }}>
      {t('No data')}
    </div>
  )
}

export default NoData
