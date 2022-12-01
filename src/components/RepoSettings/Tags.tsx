/*
 * @Author: xia xian
 * @Date: 2022-08-24 10:30:08
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-24 16:44:40
 * @Description:
 */
/*
 * @Author: xia xian
 * @Date: 2022-08-05 17:34:32
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-22 15:55:19
 * @Description:
 */
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material'
import { updateTagList } from 'actions/interface'
import { RootState } from 'actions/types'
import { useConfirm } from 'hooks/useConfirm'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoTrashcan } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import TagService from '../../relatives/services/Tag'
import TagForm from './TagForm'
import './Version.sass'
type Props = {
  id: number
}
export default function Tags(props: Props) {
  const { id, setRefresh } = props
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [open, setOpen] = useState(false)
  const confirm = useConfirm()
  const { t } = useTranslation()
  const rows = useSelector((state: RootState) => state.tags)
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const setTags = (tags) => {
    dispatch(updateTagList(tags))
    setPage(0)
  }
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
  const handleCreateTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setOpen(true)
  }
  const handleDelete = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    tagId: number,
    name: string
  ) => {
    e.stopPropagation()
    const content = (
      <div>
        <div>
          {t('Confirm delete')} {name} {t('Tags')}
          {t('?')}
        </div>
        <div>{t('removeTagNotice')}</div>
      </div>
    )
    confirm({
      title: t('Confirm delete'),
      content,
    }).then(async () => {
      const result = await TagService.removeTag({
        tagId,
        id,
      })
      if (result.isOk) {
        setTags(rows.filter((v) => v.id !== tagId))
        setRefresh(true)
      } else if (result.errMsg) {
        enqueueSnackbar(result.errMsg, { variant: 'error' })
      }
    })
  }
  const isSelected = (name: string) => selected.indexOf(name) !== -1
  const handleFormClose = async (name?: string) => {
    if (name) {
      const response = await TagService.createTag({
        name,
        repositoryId: id,
        level: 'repository',
      })
      const { isOk, errMsg, data } = response

      if (isOk && data?.created && data?.tag) {
        setTags([...rows, data.tag])
      } else if (errMsg) {
        enqueueSnackbar(errMsg, { variant: 'error' })
      }
    }
    setOpen(false)
  }
  return (
    <Container className="VersionPanel" fixed={true}>
      <Box>
        <Button variant="contained" size="small" onClick={handleCreateTag}>
          {t('Create New Tag')}
        </Button>
        <Box mt={2}>
          <Paper variant="outlined">
            <TableContainer>
              <Table aria-labelledby="tableTitle" sx={{ width: '100%' }}>
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  ).map((row, index) => {
                    const isItemSelected = isSelected(row.name)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover={true}
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          <Chip
                            variant="outlined"
                            size="small"
                            style={{
                              borderRadius: '2px',
                              background: '#fafafa',
                              border: '1px solid #d9d9d9',
                              margin: '4px',
                            }}
                            label={row.name}
                            color={row?.level === 'system' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <span
                            className="fake-link"
                            onClick={(e) => {
                              handleDelete(e, row.id, row.name)
                            }}
                          >
                            <GoTrashcan />
                          </span>
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
              count={rows.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage={`${t('Rows per page')}:`}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
      {open && <TagForm title={t('Create New Tag')} open={open} onClose={handleFormClose} />}
    </Container>
  )
}
