import { Box, Grid, Paper, List, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Button } from '@mui/material'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CREDENTIALS, serve } from '../../relatives/services/constant'
import { Tree } from '../utils'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ReplayIcon from '@mui/icons-material/Replay'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SyncIcon from '@mui/icons-material/Sync'
import { Interface } from 'actions/types'
import Spin from '../../components/utils/Spin'
import './InterfaceList.sass'
import ItfDiffModal from './ItfDiffModal'
import RestoreInterfaceForm from './RestoreInterfaceForm'
import { useConfirm } from 'hooks/useConfirm'
import { useTranslation } from 'react-i18next'
import { deleteInterface } from 'actions/interface'
import { useDispatch } from 'react-redux'

const isEqual = function(v1, v2) {
  const list = ['description', 'name', 'pos', 'required', 'rule', 'type', 'value']
  for (let i = 0; i < list.length; i++) {
    const key = list[i]
    if (v1[key] !== v2[key]) {
      return false
    }
  }

  if (!v1.chilren && !v2.children) { return true }
  if (v1.children && !v2.children) { return false }
  if (!v1.children && v2.children) { return false }
  if (v1.children.length !== v2.children.length) { return false }
  if (v1.children && v2.children) {
    const ch1 = _.sortBy(v1.children, 'name')
    const ch2 = _.sortBy(v2.children, 'name')
    for (let i = 0; i < ch1.length; i++) {
      if (!isEqual(ch1[i], ch2[i])) {
        return false
      }
    }
  }
  return true
}
const getData = function(r, v) {
  return fetch(
    `${serve}/repository/get?id=${r}${v && v !== 'null' ? `&versionId=${v}` : ''}`,
    {
      ...CREDENTIALS,
    }
  ).then(res => res.json()).then(data => data?.data || {})
}
const getDiffData = function(itfList1, itfList2, pool1, pool2) {
  const deleted = []
  const modified = []
  const added = []
  itfList1?.forEach(itf => {
    const find = pool2[`${itf.method}_${itf.url}`]
    if (find) {
      const fields = ['name', 'bodyOption', 'description', 'status']
      let i = 0
      for (; i < fields.length; i++) {
        const name = fields[i]
        if (itf[name] !== find[name]) {
          modified.push(itf)
          break
        }
      }
      if (i === fields.length) {
        const p1 = itf.properties.map(v => ({...v}))
        const p2 = find.properties.map(v => ({...v}))
        if ((!p1 && p2) || (p1 && !p2) || (p1?.length !== p2?.length)) {
          modified.push(itf)
        } else if (p1?.length && p2?.length) {
          const req1 = Tree.arrayToTree(p1.filter(s => s.scope === 'request'))
          const req2 = Tree.arrayToTree(p2.filter(s => s.scope === 'request'))
          if (isEqual(req1, req2)) {
            const res1 = Tree.arrayToTree(p1.filter(s => s.scope === 'response'))
            const res2 = Tree.arrayToTree(p2.filter(s => s.scope === 'response'))
            if (!isEqual(res1, res2)) {
              modified.push(itf)
            }
          } else {
            modified.push(itf)
          }
        }
      }
    } else {
      added.push(itf)
    }
  })
  itfList2?.forEach(itf => {
    if (!pool1[`${itf.method}_${itf.url}`]) {
      deleted.push(itf)
    }
  })
  return {
    deleted,
    modified,
    added,
  }
}
function DataList(props: {
  added: any[]
  deleted: any[]
  modified: any[]
  versionId: number
  versionId2: number
  handleDiff: (data: Interface) => void
  handleAdd: (itf: Interface) => void
  handleDelete: (itf: Interface) => void
}) {
  const { t } = useTranslation()
  const [delOpen, setDelOpen] = useState(true)
  const [addOpen, setAddOpen] = useState(true)
  const [modOpen, setModOpen] = useState(true)
  const { added, deleted, modified, versionId, versionId2, handleDiff, handleAdd, handleDelete } = props
  const handleDelClick = () => {
    setDelOpen(!delOpen)
  }
  const handleAddClick = () => {
    setAddOpen(!addOpen)
  }
  const handleModClick = () => {
    setModOpen(!modOpen)
  }
  const prefix = `${window.location.origin}/repository/editor?`
  const prefix1 = prefix + `${isNaN(versionId) ? '' : `versionId=${versionId}&`}`
  const prefix2 = prefix + `${isNaN(versionId2) ? '' : `versionId=${versionId2}&`}`

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleDelClick}>
        <ListItemIcon>
          <DeleteForeverIcon />
        </ListItemIcon>
        <ListItemText>
          {_.upperFirst(t('deleted'))} <span style={{ color: '#cf1322' }}>{deleted?.length || 0}</span> APIs
        </ListItemText>
        {delOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={delOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {deleted?.length > 0 ? deleted?.map(v => (
            <div className="diffDiv" key={v.id}><span><span className={`methodTag tagDELETE`}>{_.upperFirst(t('deleted'))}</span><a href={`${prefix2}id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
              rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a></span><IconButton onClick={() => {
              handleAdd(v)
            }}><ReplayIcon /></IconButton></div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
      <ListItemButton onClick={handleAddClick}>
        <ListItemIcon>
          <FiberNewIcon />
        </ListItemIcon>
        <ListItemText>
          {_.upperFirst(t('created'))} <span style={{ color: 'green' }}>{added?.length || 0}</span> APIs
        </ListItemText>
        {addOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={addOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {added?.length > 0 ? added?.map(v => (
            <div className="diffDiv" key={v.id}><span><span className={`methodTag tagPOST`}>{_.upperFirst(t('created'))}</span><a href={`${prefix1}&id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
              rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a></span><IconButton onClick={() => {
              handleDelete(v)
            }}><DeleteOutlineIcon /></IconButton></div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
      <ListItemButton onClick={handleModClick}>
        <ListItemIcon>
          <AutoFixHighIcon />
        </ListItemIcon>
        <ListItemText>
          {_.upperFirst(t('modified'))} <span style={{ color: '#d46b08' }}>{modified?.length || 0}</span> APIs
        </ListItemText>
        {addOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={modOpen} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true}>
          {modified?.length > 0 ? modified?.map(v => (
            <div className="diffDiv" key={v.id}><span><span className={`methodTag tagPUT`}>{_.upperFirst(t('modified'))}</span><a href={`${prefix1}&id=${v.repositoryId}&mod=${v.moduleId}&itf=${v.id}`} target="_blank"
              rel="noopener noreferrer">[{v.name}] {v.method} {v.url}</a></span>
            <IconButton onClick={() => {
              handleDiff(v)
            }}><SwapVertIcon /></IconButton>
            </div>
          )) : <div className="diffDiv">{t('There is no data')}</div>}
        </List>
      </Collapse>
    </List>
  )
}
export default function RepositoryDiff() {
  const [loading, setLoading] = useState(true)
  const [data1, setData1] = useState()
  const [data2, setData2] = useState()
  const confirm = useConfirm()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const fetchData = async () => {
    setLoading(true)
    const [d1, d2] = await Promise.all([getData(r1, v1), getData(r2, v2)])
    setData1(d1)
    setData2(d2)
    setLoading(false)
  }
  const { r1, r2, v1, v2 } = useParams<{ r1: string; r2: string; v1: string; v2: string }>()
  const [diffModalData, setDiffModalData] = useState({
    original: { name: '', code: null },
    value: { name: '', code: null },
    itf: null,
  })
  const [visible, setVisible] = useState(false)
  const [restoreOpen, setRestoreOpen] = useState(false)
  const [addModalData, setAddModalData] = useState({
    repositoryId: null,
    itfId: null,
    modules: [],
    itfName: '',
  })

  const itfList1 = data1?.modules?.reduce((prev, cur) => [...prev, ...(cur?.interfaces || [])], [])
  const itfList2 = data2?.modules?.reduce((prev, cur) => [...prev, ...(cur?.interfaces || [])], [])
  const pool1 = _.keyBy(itfList1, (o) => `${o.method}_${o.url}`)
  const pool2 = _.keyBy(itfList2, (o) => `${o.method}_${o.url}`)
  const versionName1 = data1?.version?.versionName
  const versionName2 = data2?.version?.versionName
  const handleDiff = (source: string, code: Interface) => {
    const { url, method } = code
    const oriData = source === versionName1 ? pool2 : pool1
    const oriCode = oriData[`${method}_${url}`]
    const valueVersionId = source === versionName1 ? +v1 : +v2
    setDiffModalData({
      original: {
        name: source === versionName1 ? versionName2 : versionName1,
        code: oriCode,
      },
      value: {
        name: source,
        code,
      },
      itf: { ...code, versionId: valueVersionId },
    })
    setVisible(true)
  }
  const handleAdd = (source: string, itf: Interface) => {
    setAddModalData({
      repositoryId: source === versionName1 ? r1 : r2,
      modules: source === versionName1 ? [...data1?.modules] : [...data2?.modules],
      itfId: itf.id,
      itfName: itf.name,
    })
    setRestoreOpen(true)
  }
  const handleDelete = (itf: Interface) => {
    const message = `${t('Unrecoverable after the interface is deleted')}！\n${t('Confirm delete')}『#${itf!.id} ${itf!.name}』${t('?')}`
    confirm({
      title: t('Confirm delete'),
      content: message,
    }).then(() => {
      dispatch(deleteInterface(itf.id, () => {
        fetchData()
      }))
    })
  }
  useEffect(() => {
    fetchData()
  }, [])
  const diffData = getDiffData(itfList1, itfList2, pool1, pool2)
  return (
    loading ? <Spin /> : <Box sx={{ flexGrow: 1 }}>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={6}>
          <h1 style={{ paddingLeft: '20px' }}>{versionName1 || 'master'}<IconButton onClick={() => {
            fetchData()
          }}><SyncIcon /></IconButton></h1>
          <Paper style={{ minHeight: '500px', wordBreak: 'break-all' }}>
            <DataList added={diffData.added}
              modified={diffData.modified} deleted={diffData.deleted}
              versionId={+v1} versionId2={+v2}
              handleDelete={handleDelete}
              handleDiff={(data) => { handleDiff(versionName1, data) }}
              handleAdd={(data) => { handleAdd(versionName1, data) }} />
          </Paper>
        </Grid>
        <Grid item={true} xs={6}>
          <h1 style={{ paddingLeft: '20px' }}>{versionName2 || 'master'}<IconButton onClick={() => {
            fetchData()
          }}><SyncIcon /></IconButton></h1>
          <Paper style={{ minHeight: '500px', wordBreak: 'break-all' }}>
            <DataList added={diffData.deleted}
              modified={diffData.modified.map(o => pool2[`${o.method}_${o.url}`])} deleted={diffData.added}
              versionId={+v2} versionId2={+v1}
              handleDelete={handleDelete}
              handleDiff={(data) => { handleDiff(versionName2, data) }}
              handleAdd={(data) => { handleAdd(versionName2, data) }} />
          </Paper>
        </Grid>
      </Grid>
      <ItfDiffModal visible={visible} close={() => { setVisible(false) }}
        refresh={fetchData}
        original={diffModalData.original} value={diffModalData.value} itf={diffModalData.itf} />
      <RestoreInterfaceForm
        title={t('Restore interface')}
        modules={addModalData.modules}
        repositoryId={addModalData.repositoryId}
        itfId={addModalData.itfId}
        itfName={addModalData.itfName}
        open={restoreOpen}
        refresh={fetchData}
        onClose={() => { setRestoreOpen(false) }}
      />
    </Box>
  )
}
