import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Transition from 'components/common/Transition'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './ImportSwaggerRepositoryForm.sass'
import { TabPanel } from 'components/utils/TabPanel'
import ManualImport from './import/ManualImport'
import AutoImport from './import/AutoImport'

export enum COVER_TYPE {
  CREATE = 1,
  COVER = 2,
}

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  orgId?: number
  repositoryId?: number
  mode: string
  modId?: number
  versionId?: number
  versionName?: string
}

export enum IMPORT_TYPE {
  /** 从Swagger 2.0 URL 或 JSON 文件导入 */
  SWAGGER_2_0 = 1,
  /** 从RAP2改动时系统生成的备份JSON文件导入 */
  RAP2_ITF_BACKUP = 2,
  RAP = 3,
  /** 从YAPI导入 */
  YAPI = 4,
  /** 从protobuf3 导入 */
  PB3 = 5,
}

export enum IMPORT_MODE {
  Manual,
  Regular
}

function ImportSwaggerRepositoryForm(props: Props) {
  const [importMode, setImportMode] = useState(IMPORT_MODE.Manual)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setImportMode(newValue)
  }
  const { open, onClose} = props

  useEffect(() => {
    if(open) {
      setImportMode(IMPORT_MODE.Manual)
    }
  }, [open])

  const { t } = useTranslation()
  return (
    <Box component="section" sx={{ display: 'inline' }}>
      <Dialog
        open={open}
        maxWidth='lg'
        onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {t('Import repository')}
          <a
            href="https://github.com/infra-fe/rap-client/wiki/%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%85%A5Data-Import"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpOutlineOutlinedIcon
              sx={{
                fontSize: '18px',
                color: '#3f51b5',
                cursor: 'pointer',
                marginTop: '-2px',
              }}
            />
          </a>
          <IconButton
            aria-label="close"
            onClick={()=>onClose(true)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={importMode} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={t('Manual Import')}  />
              <Tab label={t('Auto Import')}/>
            </Tabs>
          </Box>
          <TabPanel value={importMode} index={0}>
            <ManualImport {...props} />
          </TabPanel>
          <TabPanel value={importMode} index={1}>
            <AutoImport {...props} />
          </TabPanel>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ImportSwaggerRepositoryForm
