import { Cancel, Create, History, KeyboardTab, Save } from '@mui/icons-material'
import CloudDownload from '@mui/icons-material/CloudDownload'
import CollectionsBookmarkTwoToneIcon from '@mui/icons-material/CollectionsBookmarkTwoTone'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey'
import { Box, Button, Collapse, Tooltip } from '@mui/material'
import { Interface, Repository, RootState } from 'actions/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { serve } from 'relatives/services/constant'
import { ENTITY_TYPE } from 'utils/consts'
import SceneConfigModal from '../scene/SceneConfigModal'
import HistoryLogDrawer from './HistoryLogDrawer'
interface Props {
  auth: any
  repository: Repository
  locker?: any
  editable: boolean
  moveInterface: any
  handleSaveInterfaceAndProperties: any
  handleUnlockInterface: any
  handleMoveInterface: any
  handleEditInterface: any
  itf: Interface
  onValidate?: () => void
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
    itf,
    onValidate,
  } = props

  const loading = useSelector((state: RootState) => state.loading)
  const [showHistory, setShowHistory] = useState(false)
  const [showSceneConfig, setShowConfig] = useState(false)
  const [showMore, setShowMore] = useState(!repository.canUserEdit ?? false)
  const { t } = useTranslation()
  // if (!repository.canUserEdit) { return null }
  if (editable) {
    return (
      <div className="InterfaceEditorToolbar">
        {repository.canUserEdit ? (
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
        ) : null}
        {repository.canUserEdit ? (
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
        ) : null}
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
      <Box>
        {repository.canUserEdit ? (
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
        ) : null}
        {repository.canUserEdit ? (
          <Button
            className="guide-2"
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => setShowConfig(true)}
            size="small"
          >
            {t('scene')}
            <CollectionsBookmarkTwoToneIcon sx={{ ml: 1 }} />
          </Button>
        ) : null}
        <Button
          className="guide-2"
          sx={{ m: 1 }}
          variant="contained"
          onClick={() => { onValidate && onValidate() }}
          size="small"
        >
          {t('Validation')}
          <ElectricalServicesIcon sx={{ ml: 1 }} />
        </Button>
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
        <Box onClick={() => setShowMore(!showMore)} className="g-link edit" sx={{ display: 'inline-block', width: '60px' }}>
          {!showMore ? <><KeyboardArrowDownIcon className="fontsize-14" /> {t('unfold')}</> :
            <><KeyboardControlKeyIcon className="fontsize-14" /> {t('fold')}</>}
        </Box>
      </Box>
      <Collapse in={showMore}>
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={t('Export of backup files can be imported into other projects, or the project')} arrow={true}>
            <Button
              className="guide-2"
              sx={{ m: 1 }}
              variant="contained"
              onClick={() => window.open(`${serve}/interface/backup/JSONData/${itf.id}`)}
              size="small"
            >
              {t('Export')}
              <CloudDownload sx={{ ml: 1 }} />
            </Button>
          </Tooltip>
          {repository.canUserEdit ? (
            <Tooltip title={t('To move or copy the interface')} arrow={true}>
              <Button
                sx={{ m: 1 }}
                data-ga-function-name="Move/Copy interface" data-ga-function-type="create"
                onClick={handleMoveInterface}
                variant="contained"
                size="small"
              >
                {t('Move/Copy interface')}
                <KeyboardTab sx={{ ml: 1 }} />
              </Button>
            </Tooltip>
          ) : null}
        </Box>
      </Collapse>
      <HistoryLogDrawer
        open={showHistory}
        onClose={() => setShowHistory(false)}
        entityId={itf.id}
        entityType={ENTITY_TYPE.INTERFACE}
        versionId={repository?.version?.id}
      />
      {showSceneConfig && (
        <SceneConfigModal
          itfMethod={itf.method}
          itfUrl={itf.url}
          itfName={itf.name}
          moduleId={itf.moduleId}
          repositoryId={itf.repositoryId}
          interfaceId={itf.id}
          basePath={repository.basePath}
          version={repository?.version}
          showSceneConfig={showSceneConfig}
          closeSceneConfig={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}

export default InterfaceEditorToolbar
