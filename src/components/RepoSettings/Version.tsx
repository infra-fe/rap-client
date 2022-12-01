/*
 * @Author: xia xian
 * @Date: 2022-08-05 17:34:32
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-21 18:37:15
 * @Description:
 */
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Stack } from '@mui/material'
import { RootState } from 'actions/types'
import { useConfirm } from 'hooks/useConfirm'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoGitBranch, GoTrashcan } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import { initVersion } from '../../actions/repository'
import VersionService from '../../relatives/services/Version'
import { formatDateTime } from '../../utils/DateUtility'
import './Version.sass'
import VersionForm from './VersionForm'
import DiffForm from './DiffForm'
type Props = {
  id: number
  onAddVersion?: () => void
  onDeleteVersion?: (id: number) => void
}
export default function Versions(props: Props) {
  const { id, onAddVersion, onDeleteVersion } = props
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [open, setOpen] = useState(false)
  const [diffOpen, setDiffOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [isInitial, setIsInitial] = useState(false)
  const repositoryAsync = useSelector((state: RootState) => state.repository)
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const { t } = useTranslation()
  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleCreateVersion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setOpen(true)
  }
  const handleDelete = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    versionId: number,
    name: string
  ) => {
    e.stopPropagation()
    const content = (
      <div>
        <span>
          {t('Confirm delete')} {name} {t('Version')}
          {t('?')}
        </span>
      </div>
    )
    confirm({
      title: t('Confirm delete'),
      content,
    }).then(async () => {
      await VersionService.removeVersion({
        versionId,
        id,
      })
      fetchList(id, 0, 5)
      onDeleteVersion && onDeleteVersion(versionId)
    })
  }
  const fetchList = async function(id: number, page: number, limit: number) {
    const result = await VersionService.fetchVersionList({
      repositoryId: id,
      start: page + 1,
      limit: rowsPerPage,
    })
    if (result.isOk) {
      setRows(result?.data?.list || [])
      setTotal(result?.data.total || 0)
    }
  }
  const handleFormClose = (refresh) => {
    setOpen(false)
    if (refresh) {
      fetchList(id, 0, 5)
      onAddVersion && onAddVersion()
    }
  }
  const isSelected = (name: string) => selected.indexOf(name) !== -1
  useEffect(() => {
    if (id) {
      fetchList(id, page, rowsPerPage)
    }
  }, [id, page, rowsPerPage])
  const { enqueueSnackbar } = useSnackbar()
  const handleInit = () => {
    const content = (
      <div>
        <span>
          {t('Confirm')}
          {t('Initialize Version').toLocaleLowerCase()}
          {t('?')}
        </span>
      </div>
    )
    confirm({
      title: t('Confirm'),
      content,
    }).then(async () => {
      setIsInitial(true)
      dispatch(
        initVersion(
          id,
          (res) => {
            setIsInitial(false)
            fetchList(id, 0, 5)
            if (!res) {
              enqueueSnackbar(t('Init version failed'), { variant: 'error' })
            }
          },
          () => {
            enqueueSnackbar('error', { variant: 'error' })
          }
        )
      )
    })
  }
  return (
    <Container className='VersionPanel' fixed={true}>
      {repositoryAsync?.data?.version ? (<Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleCreateVersion}>{t('Create a new version')}</Button>
          <Button variant="contained" size="small" onClick={() => { setDiffOpen(true) }}>{t('Diff two versions')}</Button>
        </Stack>
        <Box mt={2}>
          <Paper variant="outlined">
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                sx={{ width: '100%' }}
              >
                <TableBody>
                  {
                    rows.map((row, index) => {
                      const isItemSelected = isSelected(row.versionName)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover={true}
                          onClick={(event) => handleClick(event, row.versionName)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.versionName}
                          selected={isItemSelected}
                        >
                          <TableCell component="th" id={labelId} scope="row">
                            <div>
                              <GoGitBranch /> {row.versionName}
                            </div>
                            <div>
                              {formatDateTime(row.updatedAt)} {t(' update')}
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            {row.versionName !== 'master' && (
                              <span
                                className="fake-link"
                                onClick={(e) => {
                                  handleDelete(e, row.id, row.name)
                                }}
                              >
                                <GoTrashcan />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
          </Paper>
        </Box>
      </Box>
      ) : (
        <Box>
          <h2 style={{ color: 'rgba(0,0,0,0.75)' }}>{t('Version Initial Note')}</h2>
          <Button variant="contained" color="primary" onClick={handleInit} disabled={isInitial}>
            {isInitial ? t('Initializing') : t('Initialize Version')}
          </Button>
          <a
            href="https://github.com/infra-fe/rap-client/wiki/Repository-Version-Mangement"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpOutlineOutlinedIcon
              sx={{ fontSize: '24px', color: '#3f51b5', cursor: 'pointer', margin: '2px' }}
            />
          </a>
        </Box>
      )}
      {open && (
        <VersionForm
          title={t('Create a new version')}
          open={open}
          onClose={handleFormClose}
          repositoryId={id}
        />
      )}
      {diffOpen && (
        <DiffForm
          title={t('Diff two versions')}
          open={diffOpen}
          onClose={() => { setDiffOpen(false) }}
          repositoryId={id}
        />
      )}
    </Container>
  )
}
