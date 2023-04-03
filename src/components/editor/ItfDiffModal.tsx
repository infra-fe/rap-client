/*
 * @Author: xia xian
 * @Date: 2022-11-03 18:09:23
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 10:24:45
 * @Description:
 */
import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Button, DialogActions } from '@mui/material'
import { Interface } from 'actions/types'
import { useTranslation } from 'react-i18next'
import { MonacoDiffEditor } from 'react-monaco-editor'
import { useConfirm } from 'hooks/useConfirm'
import {  RootState } from '../../actions/types'
import { useSelector } from 'react-redux'
import Editor from '../../relatives/services/Editor'
import { Tree } from '../utils'

interface IModalProps {
  close: (status?: boolean) => void
  refresh: () => void
  visible: boolean
  itf: Interface & { versionId: number }
  original: {
    name: string
    code: Interface
  }
  value: {
    name: string
    code: Interface
  }
}
function handleProperties(properties) {
  return properties.map(v => ({
    scope: v.scope,
    type: v.type,
    pos: v.pos,
    name: v.name,
    rule: v.rule,
    value: v.value,
    description: v.description,
    required: v.required,
    children: handleProperties(v.children),
  }))
}
function handleDisplayCode(code) {
  if (code && code.properties) {
    const obj = {
      name: code.name,
      url: code.url,
      method: code.method,
      bodyOption: code.bodyOption,
      description: code.description,
      request: code.properties.filter(v => v.scope === 'request').map(v => ({...v})),
      response: code.properties.filter(v => v.scope === 'response').map(v => ({...v})),
    }
    obj.request = Tree.arrayToTree(obj.request)
    obj.response = Tree.arrayToTree(obj.response)
    obj.request = handleProperties(obj.request.children)
    obj.response = handleProperties(obj.response.children)
    return obj
  }
  return {}
}
export function getUpdateParams(itf: Interface, newItf: Interface, authId: number){
  return {
    id: itf.id,
    name: newItf.name,
    status: newItf.status,
    bodyOption: newItf.bodyOption,
    description: newItf.description,
    properties: newItf.properties.map(v => ({
      ...v,
      creatorId: authId,
      id: `memory-${v.id}`,
      interfaceId: itf.id,
      memory: true,
      moduleId: itf.moduleId,
      parentId: `${v.parentId === -1 ? v.parentId : `memory-${v.parentId}`}`,
      repositoryId: itf.repositoryId,
    })),
  }
}
export default function ItfDiffModal(props: IModalProps) {
  const { t } = useTranslation()
  const confirm = useConfirm()
  const auth = useSelector((state: RootState) => state.auth)
  const { close, visible, itf, original, value, refresh } = props
  const disCode1 = handleDisplayCode(original?.code)
  const disCode2 = handleDisplayCode(value?.code)

  const handleClose = () => {
    close(false)
  }
  const handleUpdate = () => {
    const itf = original.code
    const newItf = value.code
    const message = `${t('Confirm to update version')} ${original.name}?`
    confirm({
      title: t('confirm') + t(' update'),
      content: message,
    }).then(async () => {
      const params = getUpdateParams(itf, newItf, auth.id)
      await Editor.updateInterface(params)
      refresh()
      handleClose()
    })
  }

  const prefix = `${window.location.origin}/repository/editor?${isNaN(itf?.versionId) ? '' : `versionId=${itf?.versionId}&`}`
  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="lg">
      <DialogTitle className="rmodal-header">
        <span className="rmodal-title">
          <div>
            <span>
              {original?.name} vs. {value?.name}
            </span>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ float: 'right' }}
              size="large">
              <Close />
            </IconButton></div>
          <div style={{ fontSize: '14px' }}>
            <a href={`${prefix}id=${itf?.repositoryId}&mod=${itf?.moduleId}&itf=${itf?.id}`} target="_blank"
              rel="noopener noreferrer">[{itf?.name}] {itf?.method} {itf?.url}</a>
          </div>
        </span>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box className="rmodal-body" sx={{ display: 'flex', width: '100%', height: 500 }}>
          <MonacoDiffEditor
            width="800"
            height="600"
            language="json"
            original={JSON.stringify(disCode1 || {}, null, 2)}
            value={JSON.stringify(disCode2 || {}, null, 2)}
            options={{ readOnly: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>{t('cancel')}</Button>
        <Button variant="contained" color="primary" onClick={handleUpdate}>{t('Update')}</Button>
      </DialogActions>
    </Dialog>
  )
}
