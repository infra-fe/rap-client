/*
 * @Author: xia xian
 * @Date: 2022-11-04 14:47:25
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-04 16:52:44
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { moveInterface } from '../../actions/interface'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, MenuItem, Select } from '@mui/material'
import { Module } from 'actions/types'
import { useDispatch } from 'react-redux'

const OP_COPY = 2

interface Props {
  title: string
  repositoryId: number
  itfId: number
  itfName: string
  open: boolean
  modules: Module[]
  refresh: () => void
  onClose: () => void
}
export default function RestoreInterfaceForm(props: Props) {
  const { repositoryId, title, itfId, onClose, open, modules, refresh, itfName } = props
  const [modId, setModId] = useState<number>()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleSubmit = (e?: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = {
      modId,
      op: OP_COPY,
      itfId,
      repositoryId,
      interfaceName: itfName,
    }
    dispatch(
      moveInterface(params, () => {
        refresh()
        onClose()
      })
    )
  }
  useEffect(() => {
    if (modules.length) {
      setModId(modules[0].id)
    }
  }, [modules])
  return (
    <Dialog open={open} onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <Box component="form" sx={{ minWidth: '500px' }} onSubmit={handleSubmit}>
          <div className="rmodal-body">
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
