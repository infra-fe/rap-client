import * as React from 'react'
import {Box,TableHead, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TablePagination, Switch} from '@mui/material'
import AutoImportForm, {EditType} from './AutoImportForm'
import {FREQUENCY_TYPE, IMPORT_SOURCE, IAutoImportModel} from 'relatives/services/AutoImport'
import * as AutoImportService from 'relatives/services/AutoImport'
import {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useConfirm } from 'hooks/useConfirm'
import { useSnackbar } from 'notistack'
import AutoImportHistory from './AutoImportHistory'
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

export default function AutoImport(props: Props) {
  const [selectImportId, setSelectImportId] = useState<number>()
  const [openHistory, setOpenHistory] = useState(false)
  const {repositoryId, versionId, versionName} = props
  const [autoImportList, setAutoImportList] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [total, setTotal] = useState(0)
  const confirm = useConfirm()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  function fetchList() {
    AutoImportService.getAutoImportList({repositoryId, versionId, offset: page * rowsPerPage, limit: rowsPerPage}).then(res=>{
      setAutoImportList(res?.data?.list || [])
      setTotal(res?.data.count || 0)
    })
  }

  useEffect(()=>{
    fetchList()
  },[repositoryId, page, rowsPerPage])

  const [open, setOpen] = React.useState(false)
  const onClose = (isOk?: boolean) => {
    if(isOk) {
      fetchList()
    }
    setOpen(false)
  }
  const [editType, setEditType] = React.useState<EditType>(EditType.Add)

  const [initialValues, setInitialValues] = React.useState<IAutoImportModel>()

  function createTask() {
    setEditType(EditType.Add)
    setOpen(true)
    setInitialValues({
      importSource: IMPORT_SOURCE.YAPI,
      frequency: FREQUENCY_TYPE.ThreeHours,
      taskName: '',
      repositoryId,
      importHost: '',
      importToken: '',
      importProjectId: '',
    })
  }

  function deleteTask(id: number) {
    confirm({
      title: t('Confirm delete'),
      content: t('Confirm delete task'),
    }).then(() => {
      AutoImportService.deleteAutoImport(id, repositoryId).then(res=>{
        setPage(0)
        fetchList()
      })
    })
  }

  function executeTask(id: number) {
    confirm({
      title: t('Confirm execute'),
      content: t('Confirm execute task'),
    }).then(() => {
      AutoImportService.executeAutoImport(id, repositoryId).then(res=>{
        if(res.isOk) {
          enqueueSnackbar(`execute success, page will reload immediately`, { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
          setTimeout(()=>{
            window.location.reload()
          },1000)
        } else {
          enqueueSnackbar(`execute failed: ${res.message}`, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
        }
      }).catch((e) => {
        enqueueSnackbar(`execute failed: ${e?.message}`, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
      })
    })
  }

  function editTask(row: IAutoImportModel) {
    setEditType(EditType.Edit)
    setOpen(true)
    setInitialValues(row)
  }

  function switchTask(id: number, status: boolean) {
    if(status) {
      AutoImportService.closeAutoImportTask(id, repositoryId).then(res=>{
        fetchList()
      })
    } else {
      AutoImportService.openAutoImportTask(id, repositoryId).then(res=>{
        if(res.isOk === false) {
          enqueueSnackbar(`${res.message}`, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } })
        } else {
          fetchList()
        }
      })
    }
  }

  function showHistory(id: number) {
    setSelectImportId(id)
    setOpenHistory(true)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', mb: 1}}>
        {versionName ? (<Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }} >
          {t('Import version')}: {versionName}
        </Box>) : null}
        <Button variant="contained" onClick={createTask}>{t('Add')}</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('Enable')}</TableCell>
              <TableCell>{t('Task Name')}</TableCell>
              <TableCell >{t('Data Source')}</TableCell>
              <TableCell >{t('Frequency')}</TableCell>
              <TableCell >{t('Creator')}</TableCell>
              <TableCell >{t('Operation')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {autoImportList.map((row) => (
              <TableRow key={row.id}>
                <TableCell  scope="row">
                  <Switch checked={row.isEnabled} onClick={()=>switchTask(row.id, row.isEnabled)} />
                </TableCell>
                <TableCell  scope="row">
                  {row.taskName}
                </TableCell>
                <TableCell  >
                  {row.importSource}
                </TableCell>
                <TableCell >
                  {t(row.frequency)}
                </TableCell>
                <TableCell >
                  {row?.creator?.fullname}
                </TableCell>
                <TableCell >
                  <Button variant="text" onClick={()=>editTask(row)}>{t('Edit')}</Button>
                  <Button variant="text" onClick={()=>executeTask(row.id)}>{t('Execute')}</Button>
                  <Button variant="text" onClick={()=>showHistory(row.id)}>{t('History')}</Button>
                  <Button variant="text" onClick={()=>deleteTask(row.id)}>{t('Delete')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={`${t('Rows per page')}:`}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AutoImportForm
        open={open}
        onClose={onClose}
        initialValues={initialValues}
        repositoryId={repositoryId}
        editType={editType}
        versionId={versionId} />
      <AutoImportHistory importId={selectImportId} open={openHistory} onClose={()=>setOpenHistory(false)}/>
    </Box>
  )
}
