import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditorService from 'relatives/services/Editor'
import { moveInterface } from '../../actions/interface'
import { fetchJoinedRepositoryList, fetchOwnedRepositoryList } from '../../actions/repository'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material'
import { Module, Repository, RootState } from 'actions/types'
import VersionSelect from 'components/RepoSettings/VersionSelect'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

export const OP_MOVE = 1
export const OP_COPY = 2

interface Props {
  title: string
  repository: Repository
  itfId: number
  open: boolean
  mod: Module
  onClose: () => void
}
export default function MoveInterfaceForm(props: Props) {
  const { repository, title, itfId, onClose, open, mod } = props
  const [repositoryId, setRepositoryId] = useState(repository.id)
  const [modId, setModId] = useState(mod.id)
  const [op, setOp] = useState(OP_MOVE)
  const [modules, setModules] = useState(repository.modules)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [versionId, setVersionId] = useState(repository?.version?.id || null)
  const [showVersion, setShowVersion] = useState(!!versionId)

  const repositories = useSelector((state: RootState) => {
    return _.uniqBy([...state.ownedRepositories.data, ...state.joinedRepositories.data], 'id')
  })
  const fetchModuleList = (repositoryId: number, versionId: number) => {
    EditorService.fetchModuleList({
      repositoryId,
      versionId,
    }).then(res => {
      setModules(res)
      setModId(res[0] && res[0].id)
    })
  }
  useEffect(() => {
    if (!repositories.length) {
      dispatch(fetchJoinedRepositoryList())
      dispatch(fetchOwnedRepositoryList())
    }
  }, [dispatch, repositories.length])

  function onRepositoryChange(e: SelectChangeEvent<number>) {
    const repositoryId = e.target.value as number
    setRepositoryId(repositoryId)
    fetchModuleList(repositoryId, versionId)
    setShowVersion(true)
  }

  const handleSubmit = (e?: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = {
      modId,
      op,
      itfId,
      repositoryId,
    }
    dispatch(
      moveInterface(params, () => {
        onClose()
      })
    )
  }
  const handleVersionChange = (v) => {
    if (v) {
      setVersionId(v.id)
      fetchModuleList(repositoryId, v.id)
    } else {
      setVersionId(null)
      setShowVersion(false)
      fetchModuleList(repositoryId, null)
    }
  }
  return (
    <Dialog open={open} onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <Box component="form" sx={{ minWidth: '500px' }} onSubmit={handleSubmit}>
          <div className="rmodal-body">
            <Box sx={{ mb: 1 }}>
              <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('Select the target repository:')}</Box>
              <FormControl style={{ width: '100%' }}>
                <Select
                  onChange={onRepositoryChange}
                  value={repositoryId}
                  fullWidth={true}
                >
                  {repositories.map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {showVersion && <Box sx={{ mb: 1 }}>
              <VersionSelect
                repositoryId={repositoryId}
                label={`${t('Target')}${t('Version')}`}
                onChange={handleVersionChange}
                onListChange={handleVersionChange}
              />
            </Box>}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('Select the target module:')}</Box>
              <FormControl style={{ width: '100%' }}>
                <Select
                  onChange={e => setModId(+((e.target.value as any) as string))}
                  value={modId}
                  fullWidth={true}
                >
                  {modules.map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 9 }}>{t('Operation type:')}</Box>
              <RadioGroup
                name="radioListOp"
                value={String(op)}
                onChange={e => {
                  setOp(+(e.target as any).value)
                }}
                row={true}
              >
                <FormControlLabel value={String(OP_MOVE)} control={<Radio />} label={t('move')} />
                <FormControlLabel value={String(OP_COPY)} control={<Radio />} label={t('copy')} />
              </RadioGroup>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>
                {t('submit')}
              </Button>
              <Button onClick={() => onClose()}>{t('cancel')}</Button>
            </Box>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
