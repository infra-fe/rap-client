/*
 * @Author: xia xian
 * @Date: 2022-05-24 16:12:11
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-29 10:13:19
 * @Description:
 */
import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs } from '@mui/material'
import { RepositoryVersion } from 'actions/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TabPanel } from '../utils/TabPanel'
import OpenApi from './OpenApi'
import Tags from './Tags'
import Version from './Version'

const DefineTabs = [
  { label: 'Version', component: Version },
  { label: 'Open API', component: OpenApi },
  { label: 'Tags', component: Tags },
]

type Props = {
  open: boolean
  onClose?: (refresh?: boolean) => void
  id: number
  token: string
  tab?: number
  onAddVersion?: () => void
  onDeleteVersion?: (id: number) => void
  version: RepositoryVersion
}

export default function Settings(props: Props) {
  const { t } = useTranslation()
  const { open, onClose, tab } = props
  const [value, setValue] = useState(tab || 0)
  const [refresh, setRefresh] = useState(false)
  const handleClose = () => {
    onClose && onClose(refresh)
  }
  const childProps = {...props, setRefresh}
  return (
    <Dialog fullWidth={true} open={open}>
      <DialogTitle >
        {`${t('Repository')}${t('Settings')}`}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ float: 'right' }}
          size="large">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} aria-label="basic tabs example" onChange={(_, v) => {setValue(v)}}>
              {DefineTabs.map((item, index) => {
                return <Tab key={index} label={t(item.label)} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
              })}
            </Tabs>
          </Box>
          {DefineTabs.map((item, index) => {
            return (
              <TabPanel key={index} value={value} index={index}>
                <item.component {...childProps} />
              </TabPanel>
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions />
    </Dialog>
  )
}
