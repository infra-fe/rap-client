import * as React from 'react'
import {Box,TableHead, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TablePagination, IconButton, DialogTitle} from '@mui/material'
import * as AutoImportService from 'relatives/services/AutoImport'
import {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'
import {formatDateTime} from 'utils/DateUtility'

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  importId?: number
}

export default function AutoImportHistory(props: Props) {
  const {open, onClose} = props
  const {importId} = props
  const [autoImportList, setAutoImportList] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [total, setTotal] = useState(0)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const { t } = useTranslation()

  function fetchList() {
    if(importId === undefined) {return}
    AutoImportService.getImportHistory({importId, offset: page * rowsPerPage, limit: rowsPerPage}).then(res=>{
      setAutoImportList(res?.data?.list || [])
      setTotal(res?.data.count || 0)
    })
  }

  useEffect(()=>{
    if(open) {
      fetchList()
    }
  },[importId, page, rowsPerPage, open])

  return (
    <Dialog open={open} onClose={()=>onClose(false)} maxWidth='lg'>
      <DialogTitle>
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
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('Trigger Type')}</TableCell>
                <TableCell>{t('Execute Status')}</TableCell>
                <TableCell>{t('Start Time')}</TableCell>
                <TableCell>{t('End Time')}</TableCell>
                <TableCell >{t('Remark')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {autoImportList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell  scope="row">
                    {row.importTriggerType}
                  </TableCell>
                  <TableCell >
                    {row.importStatus}
                  </TableCell>
                  <TableCell  scope="row">
                    {formatDateTime(row.createdAt)}
                  </TableCell>
                  <TableCell  >
                    {formatDateTime(row.updatedAt)}
                  </TableCell>
                  <TableCell  >
                    {row.message}
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
      </Box>
    </Dialog>
  )
}
