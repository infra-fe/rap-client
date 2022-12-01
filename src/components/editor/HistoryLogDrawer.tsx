import DownloadIcon from '@mui/icons-material/GetApp'
import { Button, Drawer, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TablePagination } from '@mui/material'
import NoData from 'components/common/NoData'
import Markdown from 'markdown-to-jsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { serve } from 'relatives/services/constant'
import { ENTITY_TYPE, TablePaginationProps } from 'utils/consts'
import DateUtility from 'utils/DateUtility'
import RepositoryService from '../../relatives/services/Repository'

export interface HistoryLog {
  id: number
  user: {
    fullname: string
    id: number
    empId: number
  }
  entityId: number
  entityType: ENTITY_TYPE.INTERFACE | ENTITY_TYPE.REPOSITORY
  changeLog: string
  createdAt: string

  relatedJSONData?: string
  jsonDataIsNull?: boolean
}

export const LOG_SEPERATOR = '.|.'
export const LOG_SUB_SEPERATOR = '@|@'
const HistoryDirection = {
  'Interface': '接口',
  'empty url': '空URL',
  'modified': '变更了',
  'deleted': '删除了',
  'covered': '覆盖了',
  'request': '请求',
  'response': '响应',
  'parameter': '参数',
  'name': '名称',
  'require': '参数必选',
  'type': '参数类型',
  'updated': '更新了',
  'added': '新增了',
  'data is backup': '数据已备份',
  'repository has been updated by importing swagger data': '仓库导入了新的Swagger数据',
}
const FormattedRow = ({ row }: { row: HistoryLog }) => {
  const [expanded, setExpanded] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const isChinese = localStorage.getItem('i18nextLng').startsWith('zh')
  const { t } = useTranslation()
  const formatter = () => row.changeLog
    .split(LOG_SEPERATOR)
    .map(x => x.split(LOG_SUB_SEPERATOR))
    .reduceRight((a, b) => [...a, ...b], [])
    .map(x => `* ${x}`)
    .map(x => x.replace(/\[(.+?)\]/ig, ( _, match ) => {
      if (isChinese && HistoryDirection[match]) {
        return HistoryDirection[match]
      }
      return match
    }))

  const list = formatter()

  if (list.length > 5 && !expanded) {
    list.length = 5
    if (!showBtn) {
      setShowBtn(true)
    }
  }

  return (
    <div>
      <Markdown>{list.join('\n')}</Markdown>
      {showBtn && (
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setExpanded(!expanded)}
          size="small"
          className="mb1"
        >
          {expanded ? t('fold') : t('unfold')}
        </Button>
      )}
    </div>
  )
}

const EMPTY = { rows: [], count: 0 }

function HistoryLogDrawer({ versionId, entityId, entityType, open, onClose }:
{ versionId?: number; entityId: number; entityType: ENTITY_TYPE.INTERFACE | ENTITY_TYPE.REPOSITORY; open: boolean; onClose: () => void }) {
  const [result, setResult] = useState<IPagerList<HistoryLog>>(EMPTY)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const { t } = useTranslation()
  useEffect(() => {
    if (open) {
      RepositoryService.fetchHistoryLogs({ versionId, entityId, entityType, limit, offset: page * limit }).then(res => {
        setResult(res)
      })
    }
    return () => {
      setResult(EMPTY)
    }
  }, [entityId, entityType, open, limit, page])
  return (
    <Drawer open={open} onClose={onClose}>
      {result.rows.length === 0 && <NoData />}
      <List sx={{ width: '650px', overflow: 'auto', height: 'calc(100% - 50px)' }}>
        {result.rows.map(row => (
          <ListItem key={row.id}>
            <ListItemText primary={<FormattedRow row={row} />} secondary={`${DateUtility.formatDateTime(row.createdAt)} by ${row.user.fullname}`} />
            {!row.jsonDataIsNull &&
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={() => window.open(`${serve}/interface/history/JSONData/${row.id}`)}
                  size="large">
                  <DownloadIcon />
                </IconButton>
              </ListItemSecondaryAction>
            }
          </ListItem>
        ))
        }
      </List>
      <TablePagination
        sx={{ height: '50px', mb: 1.5 }}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={result.count}
        rowsPerPage={limit}
        page={page}
        onPageChange={(_, val) => setPage(val)}
        onRowsPerPageChange={e => { setLimit(parseInt(e.target.value, 10)); setPage(0) }}
        {...TablePaginationProps(t)}
      />
    </Drawer>
  )
}

export default HistoryLogDrawer
