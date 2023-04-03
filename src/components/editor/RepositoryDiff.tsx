import { Box, Grid, Paper, Button, LinearProgress, Typography, LinearProgressProps, Modal } from '@mui/material'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CREDENTIALS, serve } from '../../relatives/services/constant'
import { Tree } from '../utils'
import { Interface, Repository } from 'actions/types'
import Spin from '../../components/utils/Spin'
import ItfDiffModal, { getUpdateParams } from './ItfDiffModal'
import { useConfirm } from 'hooks/useConfirm'
import { useTranslation } from 'react-i18next'
import { addInterface, deleteInterface } from 'actions/interface'
import Editor from '../../relatives/services/Editor'
import { useDispatch } from 'react-redux'
import DiffDataList, { ICheckStatus } from './DiffDataList'
import {  RootState } from '../../actions/types'
import { useSelector } from 'react-redux'

let running = false

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
  ).then(res => res.json()).then(data => data?.data || {isOk: false})
}
const getDiffData = function(sourceList, targetList, sourcePool, targetPool) {
  const deleted = []
  const modified = []
  const added = []
  sourceList?.forEach(itf => {
    const find = targetPool[`${itf.method}_${itf.url}`]
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
  targetList?.forEach(itf => {
    if (!sourcePool[`${itf.method}_${itf.url}`]) {
      deleted.push(itf)
    }
  })
  return {
    deleted,
    modified,
    added,
  }
}
function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}
type IData = Partial<Repository> & {isOk?: boolean}

export default function RepositoryDiff() {
  const [loading, setLoading] = useState(true)
  const [sourceData, setSourceData] = useState<IData>({})
  const [targetData, setTargetData] = useState<IData>({})
  const confirm = useConfirm()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const {
    r1: sourceRepoId,
    r2: targetRepoId,
    v1: sourceVersionId,
    v2: targetVersionId,
  } = useParams<{ r1: string; r2: string; v1: string; v2: string }>()

  const fetchData = async () => {
    setLoading(true)
    const [fromData, toData] = await Promise.all([getData(sourceRepoId, sourceVersionId), getData(targetRepoId, targetVersionId)])
    setSourceData(fromData)
    setTargetData(toData)
    setLoading(false)
  }

  const [diffModalData, setDiffModalData] = useState({
    original: { name: '', code: null },
    value: { name: '', code: null },
    itf: null,
  })
  const [visible, setVisible] = useState(false)
  const routePrefix = `${window.location.origin}/repository/editor?`
  const sourcePrefix = routePrefix + `${isNaN(+sourceVersionId) ? '' : `versionId=${sourceVersionId}&`}`
  const targetPrefix = routePrefix + `${isNaN(+targetVersionId) ? '' : `versionId=${targetVersionId}&`}`

  const sourceList = sourceData?.modules?.reduce((prev, cur) => [...prev, ...(cur?.interfaces || [])], [])
  const targetList = targetData?.modules?.reduce((prev, cur) => [...prev, ...(cur?.interfaces || [])], [])
  const sourcePool = _.keyBy(sourceList, (o) => `${o.method}_${o.url}`)
  const targetPool = _.keyBy(targetList, (o) => `${o.method}_${o.url}`)
  const itfPool = _.keyBy([...(sourceList || []), ...(targetList|| [])], 'id')

  const sourceName = sourceData?.version?.versionName
  const targetName = targetData?.version?.versionName

  const handleDiff = (itf: Interface) => {
    const { url, method } = itf
    const oriCode = targetPool[`${method}_${url}`]
    setDiffModalData({
      original: {
        name: targetName,
        code: oriCode,
      },
      value: {
        name: sourceName,
        code: itf,
      },
      itf: { ...itf, versionId: sourceVersionId },
    })
    setVisible(true)
  }
  const getAddParams = (itf: Interface) => {
    const sourceModule = sourceData.modules.find(m => m.id === itf.moduleId)
    return {
      sourceId: itf.id,
      sourceName: itf.name,
      sourceModuleDesc: sourceModule.description,
      targetRepoId,
      targetModuleName: sourceModule.name,
      ...(
        targetVersionId !== 'null' ? {
          targetVersionId,
        } : {}
      ),
    }
  }
  const handleAdd = (itf: Interface) => {
    const message = `${t('Are you sure to add this API into ')}${targetName}?`
    confirm({
      title: t('Confirm add'),
      content: message,
    }).then(() => {
      dispatch(addInterface(getAddParams(itf), () => {
        fetchData()
      }))
    })
  }
  const handleDelete = (itf: Interface) => {
    const message = `${t('Are you sure to remove ')}${targetName}${t('\'s this API')}?`
    confirm({
      title: t('Confirm delete'),
      content: message,
    }).then(() => {
      dispatch(deleteInterface(itf.id, () => {
        fetchData()
      }))
    })
  }
  const [progress, setProgress] = useState(0)
  const [batchOpen, setBatchOpen] = useState(false)
  const handleCloseBatch = () => {
    running = false
    setBatchOpen(false)
    setProgress(0)
    setCheckStatus({
      checkDel: [],
      checkAdd: [],
      checkModify: [],
    })
    fetchData()
  }
  const onCloseBatch = ()=>{
    const message = `${t('The executed operations cannot be undone, are you sure you want to cancel the remaining tasks')}?`
    confirm({
      title: `${t('Confirm')}`,
      content: message,
    }).then(() => {
      handleCloseBatch()
    })
  }
  const handleBatch = () => {
    const message = `${t('Are you sure to apply all these operations to ')}${targetName}?`
    confirm({
      title: t('Confirm'),
      content: message,
    }).then(() => {
      const operations = _.flatten(Object.keys(checkStatus).map(key => checkStatus[key].map(id => ({
        key,
        id,
      }))))
      const step = 100 / operations.length
      const run = async (ops, current) => {
        if (ops.length > 0 && running) {
          const action = ops.shift()
          const newProgress = ((current + step > 100) || ops.length === 0) ? 100 : current + step
          const itf = itfPool[action.id]
          switch(action.key) {
            case 'checkDel':
              await Editor.deleteInterface(itf.id)
              break
            case 'checkAdd':
              await Editor.addInterface(getAddParams(itf))
              break
            case 'checkModify':
              const { url, method } = itf
              const oriItf = targetPool[`${method}_${url}`]
              await Editor.updateInterface(getUpdateParams(oriItf, itf, auth.id))
              break
          }
          setProgress(newProgress)
          if (ops.length > 0) {
            run(ops, newProgress)
          } else {
            handleCloseBatch()
          }
        }
      }
      running = true
      setBatchOpen(true)
      run(operations, 0)
    })
  }
  useEffect(() => {
    fetchData()
  }, [])
  const diffData = getDiffData(sourceList, targetList, sourcePool, targetPool)
  const [checkStatus, setCheckStatus] = useState<ICheckStatus>({
    checkDel: [],
    checkAdd: [],
    checkModify: [],
  })
  const onSelect = (type: string, ids: number[]) => {
    const status = {
      ...checkStatus,
    }
    status[type] = ids
    setCheckStatus(status)
  }
  return (
    loading ? <Spin /> : <Box sx={{ flexGrow: 1 }}>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12}>
          <h1 style={{ paddingLeft: '20px' }}>
            {t('Merge')}&nbsp;
            <a href={`${sourcePrefix}id=${sourceRepoId}`} target="_blank" rel="noreferrer">{sourceName || 'master'}</a>
            &nbsp;{t('into')}&nbsp;
            <a href={`${targetPrefix}id=${targetRepoId}`} target="_blank" rel="noreferrer">{targetName || 'master'}</a>
            <Button variant="contained" style={{padding: '4px', marginLeft: '8px'}}
              disabled={
                !(checkStatus.checkAdd.length || checkStatus.checkDel.length || checkStatus.checkModify.length)
              }
              onClick={()=>{handleBatch()}}
            >
              {t('Batch Operation')}
            </Button>
          </h1>
          <Paper className="diffPaper">
            {sourceData?.isOk === false ?
              <div className="diffNoAuth">
                {t('Sorry, you have no access to visit this data')}
              </div>
              :<DiffDataList added={diffData.added}
                modified={diffData.modified} deleted={diffData.deleted}
                prefix1={sourcePrefix} prefix2={targetPrefix}
                handleDelete={handleDelete}
                handleDiff={handleDiff}
                handleAdd={handleAdd}
                checkStatus={checkStatus}
                onSelect={onSelect}
              />
            }
          </Paper>
        </Grid>
      </Grid>
      <ItfDiffModal visible={visible} close={() => { setVisible(false) }}
        refresh={fetchData}
        original={diffModalData.original} value={diffModalData.value} itf={diffModalData.itf} />
      <Modal
        open={batchOpen}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        disableEscapeKeyDown={true}
      >
        <Box className="diffBatchDiv">
          <LinearProgressWithLabel value={progress} />
          <Button style={{marginTop: '8px'}} variant="outlined" onClick={onCloseBatch}>{t('cancel')}</Button>
        </Box>
      </Modal>
    </Box>
  )
}
