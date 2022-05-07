import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Transition from 'components/common/Transition'
import { Table, TableHead, TableRow, TableCell, TableBody, DialogContent, Box } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDefaultVals, updateDefaultVals } from 'actions/repository'
import { withSnackbar, WithSnackbarProps } from 'notistack'

export interface IDefaultVal {
  name: string
  rule: string
  value: string
}

function DefaultValueModal({ open, handleClose, repositoryId, enqueueSnackbar }:
{ open: boolean; handleClose: () => void; repositoryId: number } & WithSnackbarProps) {
  const [editingData, setEditingData] = useState<IDefaultVal[]>([])
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(fetchDefaultVals(repositoryId))
  }, [dispatch, repositoryId])
  const defaultVals: IDefaultVal[] = useSelector((state: any) => state.defaultVals)

  useEffect(() => {
    setEditingData(defaultVals)
  }, [defaultVals])

  const addNewLine = () => {
    setEditingData([...editingData, {
      name: '',
      rule: '',
      value: '',
    }])
  }

  const onChange = (key: keyof IDefaultVal, i: number, val: string) => {
    setEditingData(editingData.map((x, j) => {
      if (j === i) {
        return {
          ...x,
          [key]: val,
        }
      }
      return x
    }))
  }

  const onDelete = (i: number) => {
    setEditingData(editingData.filter((_, j) => i !== j))
  }

  const onSubmit = () => {
    dispatch(updateDefaultVals(repositoryId, editingData))
    handleClose()
    enqueueSnackbar(`更新默认值成功`, {
      variant: 'success',
      autoHideDuration: 1000,
    })
  }

  return (
    <Dialog fullScreen={true} open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            size="large">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>{t('The default configuration')}</Typography>
          <Button color="inherit" onClick={onSubmit}>
            {t('save')}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography variant="body1"> {t('System will be based on the variable name to search, if has not been generating rules and the initial value to fill in, system will Mock rules of parameters with the same coverage.')}</Typography>
        </Box>
        <Box sx={{ mb: 2, mt: 2 }}>
          <Button onClick={addNewLine} color="primary" variant="contained" size="small">{t('Add a line')}</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('The variable name')}</TableCell>
              <TableCell>{t('Generate rules')}</TableCell>
              <TableCell>{t('Initial value')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {editingData.map((row, i) => (
              <TableRow key={i}>
                <TableCell scope="row">
                  <TextField
                    value={row.name}
                    onChange={e => onChange('name', i, e.target.value)}
                    placeholder={t('Please enter the variable name')}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.rule}
                    onChange={e => onChange('rule', i, e.target.value)}
                    placeholder={t('Please enter the generated rules')}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.value}
                    onChange={e => onChange('value', i, e.target.value)}
                    placeholder={t('Please input the initial value')}
                  />
                </TableCell>
                <TableCell>
                  <Delete
                    onClick={() => onDelete(i)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

export default withSnackbar(DefaultValueModal)
