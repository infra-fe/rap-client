import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { Repository, RootState } from 'actions/types'
import { Cancel, Save, KeyboardTab, Create, History } from '@mui/icons-material'
import HistoryLogDrawer from './HistoryLogDrawer'
import CloudDownload from '@mui/icons-material/CloudDownload'
import { ENTITY_TYPE } from 'utils/consts'
import { serve } from 'relatives/services/constant'

interface Props {
  auth: any
  repository: Repository
  locker?: any
  editable: boolean
  itfId: number
  moveInterface: any
  handleSaveInterfaceAndProperties: any
  handleUnlockInterface: any
  handleMoveInterface: any
  handleEditInterface: any
}

function InterfaceEditorToolbar(props: Props) {
  const {
    editable,
    locker,
    repository,
    handleEditInterface,
    handleMoveInterface,
    handleSaveInterfaceAndProperties,
    handleUnlockInterface,
    itfId,
  } = props

  const loading = useSelector((state: RootState) => state.loading)
  const [showHistory, setShowHistory] = useState(false)
  const { t } = useTranslation()
  if (!repository.canUserEdit) { return null }
  if (editable) {
    return (
      <div className="InterfaceEditorToolbar">
        <Tooltip title={t('save') + ' (CTRL + S)'}>
          <Button
            sx={{ m: 1 }}
            onClick={handleSaveInterfaceAndProperties}
            variant="contained"
            color="primary"
            disabled={loading}
            size="small"
          >
            {t('save')}
            <Save sx={{ ml: 1 }} />
          </Button>
        </Tooltip>
        <Tooltip title={t('cancel') + ' (CTRL + E)'}>
          <Button
            sx={{ m: 1 }}
            onClick={handleUnlockInterface}
            variant="contained"
            size="small"
          >
            {t('cancel')}
            <Cancel sx={{ ml: 1 }} />
          </Button>
        </Tooltip>
        <span className="locker-warning hide">{t('Have lock the current interface!')}</span>
      </div>
    )
  }
  if (locker) {
    return (
      <div className="InterfaceEditorToolbar">
        <div className="alert alert-danger">
          {t('The current interface has been')} <span className="nowrap">{locker.fullname}</span> {t('The lock')}
        </div>
      </div>
    )
  }
  return (
    <div className="InterfaceEditorToolbar">
      <Tooltip title={t('Export of backup files can be imported into other projects, or the project')} arrow={true}>
        <Button
          className="guide-2"
          sx={{ m: 1 }}
          variant="contained"
          onClick={() => window.open(`${serve}/interface/backup/JSONData/${itfId}`)}
          size="small"
        >
          {t('Export')}
          <CloudDownload sx={{ ml: 1 }} />
        </Button>
      </Tooltip>
      <Tooltip title={t('View the history of all changes in the interface')} arrow={true}>
        <Button
          className="guide-2"
          variant="contained"
          sx={{ m: 1 }}
          onClick={() => setShowHistory(true)}
          size="small"
        >
          {t('History')}
          <History sx={{ ml: 1 }} />
        </Button>
      </Tooltip>
      <Tooltip title={t('To move or copy the interface')} arrow={true}>
        <Button
          sx={{ m: 1 }}
          onClick={handleMoveInterface}
          variant="contained"
          size="small"
        >
          {t('move')}
          <KeyboardTab sx={{ ml: 1 }} />
        </Button>
      </Tooltip>
      <Tooltip title={`${t('Click to enter edit mode, and lock the interface')} (CTRL + E)'`} arrow={true}>
        <Button
          sx={{ m: 1 }}
          onClick={handleEditInterface}
          variant="contained"
          color="primary"
          disabled={loading}
          size="small"
        >
          {t('Edit')}
          <Create sx={{ ml: 1 }} />
        </Button>
      </Tooltip>
      <HistoryLogDrawer
        open={showHistory}
        onClose={() => setShowHistory(false)}
        entityId={props.itfId}
        entityType={ENTITY_TYPE.INTERFACE}
      />
    </div>
  )
}

export default InterfaceEditorToolbar
