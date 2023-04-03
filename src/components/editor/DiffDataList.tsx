import { List, ListItemButton, ListItemText, Collapse, Divider, Button, Checkbox  } from '@mui/material'
import _ from 'lodash'
import { useState } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Interface } from 'actions/types'
import './RepositoryDiff.sass'
import { useTranslation } from 'react-i18next'
import './DiffDataList.sass'

export interface ICheckStatus {
  checkDel: number[]
  checkAdd: number[]
  checkModify: number[]
}
export default function DiffDataList(props: {
  added: any[]
  deleted: any[]
  modified: any[]
  handleDiff: (data: Interface) => void
  handleAdd: (itf: Interface) => void
  handleDelete: (itf: Interface) => void
  prefix1: string
  prefix2: string
  checkStatus: ICheckStatus
  onSelect: (type: string, ids: number[]) => void
}) {
  const { t } = useTranslation()
  const [delOpen, setDelOpen] = useState(true)
  const [addOpen, setAddOpen] = useState(true)
  const [modOpen, setModOpen] = useState(true)
  const { added, deleted, modified, prefix1, prefix2, handleDiff, handleAdd, handleDelete, checkStatus, onSelect } = props
  const { checkDel, checkAdd, checkModify } = checkStatus
  const handleDelClick = () => {
    setDelOpen(!delOpen)
  }
  const handleAddClick = () => {
    setAddOpen(!addOpen)
  }
  const handleModClick = () => {
    setModOpen(!modOpen)
  }
  const delIds = deleted?.map(v => v.id) || []
  const addIds = added?.map(v => v.id) || []
  const modifyIds = modified?.map(v => v.id) || []

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleDelClick}>
        <ListItemText>
          <div className="diffDot"></div>
          {
            deleted?.length > 0 && <Checkbox className="diffCheck"
              checked={checkDel.length === deleted?.length}
              indeterminate={checkDel.length > 0 && checkDel.length !== deleted?.length}
              onChange={(e) => {
                onSelect('checkDel', e.target.checked ? delIds : [])
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}/>
          }
          <span style={{ color: '#cf1322' }}>{deleted?.length || t('No APIs')}</span>{deleted?.length ? t('unit') : ''}{t('APIs are removed')}
        </ListItemText>
        {delOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={delOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {deleted?.length > 0 ? deleted?.map(v => (
            <div className="diffDiv" key={v.id}>
              <Checkbox
                checked={checkDel.includes(v.id)}
                onChange={(e) => {
                  onSelect('checkDel', e.target.checked ? _.union(checkDel, [v.id]) : _.xor(checkDel, [v.id]) )
                }}
              />
              <Button variant="contained" color="error" className="diffAction" onClick={() => {
                handleDelete(v)
              }}>
                {t('Delete')}
              </Button>
              <a href={`${prefix2}id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
                rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a></div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
      <Divider />
      <ListItemButton onClick={handleAddClick}>
        <ListItemText>
          <div className="diffDot"></div>
          {
            added?.length > 0 && <Checkbox className="diffCheck"
              checked={checkAdd.length === added?.length}
              indeterminate={checkAdd.length > 0 && checkAdd.length !== added?.length}
              onChange={(e) => {
                onSelect('checkAdd', e.target.checked ? addIds : [])
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}/>
          }
          <span style={{ color: 'green' }}>{added?.length || t('No APIs')}</span>{added?.length ? t('unit') : ''}{t('APIs are new')}
        </ListItemText>
        {addOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={addOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {added?.length > 0 ? added?.map(v => (
            <div className="diffDiv" key={v.id}>
              <Checkbox
                checked={checkAdd.includes(v.id)}
                onChange={(e) => {
                  onSelect('checkAdd', e.target.checked ? _.union(checkAdd, [v.id]) : _.xor(checkAdd, [v.id]) )
                }}
              />
              <Button variant="contained" color="success" className="diffAction" onClick={
                () => {
                  handleAdd(v)
                }
              }>
                {t('Add')}
              </Button>
              <a href={`${prefix1}&id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
                rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a></div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
      <Divider />
      <ListItemButton onClick={handleModClick}>
        <ListItemText>
          <div className="diffDot"></div>
          {
            modified?.length > 0 && <Checkbox className="diffCheck"
              checked={checkModify.length === modified?.length}
              indeterminate={checkModify.length > 0 && checkModify.length !== modified?.length}
              onChange={(e) => {
                onSelect('checkModify', e.target.checked ? modifyIds : [])
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}/>
          }
          <span style={{ color: '#d46b08' }}>{modified?.length || t('No APIs')}</span>{modified?.length ? t('unit') : ''}{t('APIs are modified')}
        </ListItemText>
        {addOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={modOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {modified?.length > 0 ? modified?.map(v => (
            <div className="diffDiv" key={v.id}>
              <Checkbox
                checked={checkModify.includes(v.id)}
                onChange={(e) => {
                  onSelect('checkModify', e.target.checked ? _.union(checkModify, [v.id]) : _.xor(checkModify, [v.id]) )
                }}
              />
              <Button variant="contained" color="warning" className="diffAction" onClick={
                () => {
                  handleDiff(v)
                }
              }>
                {t('Update')}
              </Button>
              <a href={`${prefix1}&id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
                rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a>
            </div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
    </List>
  )
}
