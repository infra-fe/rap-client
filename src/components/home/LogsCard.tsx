import { useTranslation } from 'react-i18next'
import React from 'react'
import { Link, moment } from '../../family'
import { Spin } from '../utils'
import { Card } from '@mui/material'

//  <img alt={user.empId} src={`https://work.alibaba-inc.com/photo/${user.empId}.220x220.jpg`} className="Log-avatar" />
const UserAvatar = ({ user }: any) => null
const UserLink = ({ user }: any) => (
  <span className="Log-user-link">{user.fullname}</span>
)
const LogUserView = ({ user }: any) => {
  return (
    <span className="Log-user">
      <UserAvatar user={user} />
      <UserLink user={user} />
    </span>
  )
}
const LogTypeView = ({ type }: any) => {
  const { t } = useTranslation()
  const typeName: any = ({
    create: t('created'),
    update: t('modified'),
    delete: t('deleted'),
    lock: t('locked'),
    unlock: t('released'),
    join: t('joined'),
    exit: t('exited'),
  } as any)[type]
  return <span className="Log-type">{typeName}</span>
}
const LogTargetView = ({ log }: any) => {
  const targetType = (log.organization && 'organization') || // 团队
    (log.repository && !log.module && !log.interface && 'repository') || // 仓库
    (log.repository && log.module && !log.interface && 'module') || // 模块
    (log.repository && log.module && log.interface && 'interface') // 接口
  switch (targetType as any) {
    case 'organization':
      return !log.organization.deletedAt
        ? <span className="Log-target"><Link to={`/organization/repository?organization=${log.organization.id}`}>{log.organization.name}</Link></span>
        : <s>{log.organization.name}</s>
    case 'repository':
      return !log.repository.deletedAt
        ? <span className="Log-target"><Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link></span>
        : <s>{log.repository.name}</s>
    case 'module':
      return (
        <span className="Log-target">
          {!log.repository.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link>
            : <s>{log.repository.name}</s>
          }
          <span className="slash"> / </span>
          {!log.module.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{log.module.name}</Link>
            : <s>{log.module.name}</s>
          }
        </span>
      )
    case 'interface':
      return (
        <span className="Log-target">
          {!log.repository.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link>
            : <s>{log.repository.name}</s>
          }
          <span className="slash"> / </span>
          {!log.module.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{log.module.name}</Link>
            : <s>{log.module.name}</s>
          }
          <span className="slash"> / </span>
          {!log.interface.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}&itf=${log.interface.id}`}>{log.interface.name}</Link>
            : <s>{log.interface.name}</s>
          }
        </span>
      )
    default:
      return <div />
  }
}
const FromNow = ({ date }: any) => (
  <i className="Log-fromnow">{moment(date).fromNow()}</i>
)

const LogView = ({ log }: any) => {
  if (log.creator && /join|exit/.test(log.type) && log.creator.id !== log.user.id) {
    // if (log.creator.id === log.user.id) return null
    if (log.type === 'join') { return <JoinLogView log={log} /> }
    if (log.type === 'exit') { return <ExitLogView log={log} /> }
  }
  if (!log.repository) {
    return null
  }
  return (
    <div className="Log clearfix">
      <div className="Log-body">
        <LogUserView user={log.user} />
        <LogTypeView type={log.type} />
        <LogTargetView log={log} />
      </div>
      <div className="Log-footer">
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}

// DONE 2.3 支持『上帝之手』`log.creator`
// 墨智邀请麦少加入群聊
const JoinLogView = ({ log }: any) => {
  const { t } = useTranslation()
  return (
    <div className="Log clearfix">
      <div className="Log-body">
        <LogUserView user={log.creator} />
        <span className="Log-type">{t('invited')}</span>
        <UserLink user={log.user} />
        <span className="Log-type">{t('joined')}</span>
        <LogTargetView log={log} />
      </div>
      <div className="Log-footer">
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}
// 墨智将麦少移出群聊
const ExitLogView = ({ log }: any) => {
  const { t } = useTranslation()
  return (
    <div className="Log clearfix">
      <div className="Log-body">
        <LogUserView user={log.creator} />
        <span className="Log-type">{t('will')}</span>
        <UserLink user={log.user} />
        <span className="Log-type">{t('Move out of the')}</span>
        <LogTargetView log={log} />
      </div>
      <div className="Log-footer">
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}

export const Log = ({ log }: any) => {
  const { t } = useTranslation()
  // const userAvatar = <img alt={log.user.empId} src={`https://work.alibaba-inc.com/photo/${log.user.empId}.220x220.jpg`} className="avatar" />
  const userAvatar = null
  // const userLink = <Link to={`https://work.alibaba-inc.com/work/u/${log.user.empId}`} target="_blank">{log.user.fullname}</Link>
  const userLink = null
  const fromNow = <i className="fromnow">{moment(log.updatedAt).fromNow()}</i>
  let targetName: any, targetLink: any, typeName: any
  if (log.organization) { // 团队
    targetName = log.organization.name
    targetLink = !log.organization.deletedAt
      ? <Link to={`/organization/repository?organization=${log.organization.id}`}>{targetName}</Link>
      : targetName
  }
  if (log.repository && !log.module && !log.interface) { // 仓库
    targetName = log.repository.name
    targetLink = !log.repository.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}`}>{targetName}</Link>
      : targetName
  } else if (log.repository && log.module && !log.interface) { // 模块
    targetName = `${log.repository.name} / ${log.module.name}`
    targetLink = !log.repository.deletedAt && !log.module.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{targetName}</Link>
      : targetName
  } else if (log.repository && log.module && log.interface) { // 接口
    targetName = `${log.repository.name} / ${log.module.name} / ${log.interface.name}`
    targetLink = !log.repository.deletedAt && !log.module.deletedAt && !log.interface.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}&itf=${log.interface.id}`}>{targetName}</Link>
      : targetName
  }

  switch (log.type) {
    case 'create':
      return targetLink ? (
        <div className="Log clearfix">
          {userAvatar} <span className="body">{userLink} <span className="ml6 mr6">{t('created')}</span> {targetLink}</span> {fromNow}
        </div>
      ) : null
    case 'update':
      return targetLink ? (
        <div className="Log clearfix">
          {userAvatar} <span className="body">{userLink} <span className="ml6 mr6">{t('modified')}</span> {targetLink}</span> {fromNow}
        </div>
      ) : null
    case 'delete':
      return targetName ? (
        <div className="Log clearfix">
          {userAvatar} <span className="body">{userLink} <span className="ml6 mr6">{t('deleted')}</span> <s>{targetName}</s></span> {fromNow}
        </div>
      ) : null
    case 'lock':
    case 'unlock':
      typeName = ({ lock: t('lock'), unlock: t('release') } as any)[log.type]
      if (!log.repository || !log.module || !log.interface) { return null }
      return (
        <div className="Log clearfix">
          {userAvatar} <span className="body">{userLink} <span className="ml6 mr6">{typeName}{t('the')}</span> {targetLink}</span> {fromNow}
        </div>
      )
    case 'join':
    case 'exit':
      typeName = ({ join: t('join'), exit: t('exit') } as any)[log.type]
      return targetName ? (
        <div className="Log clearfix">
          {userAvatar} <span className="body">{userLink} <span className="ml6 mr6">{typeName}{t('the')}</span> {targetLink}</span> {fromNow}
        </div>
      ) : null
    default:
      return null
    // return <p>{JSON.stringify(log)}</p>
  }
}
const LogsCard = ({ logs }: any) => {
  const { t } = useTranslation()
  return (
    <Card className="Logs card">
      <div className="card-header">{t('Recent activities')}</div>
      {logs.fetching ? <Spin /> : (
        <div className="card-block">
          {logs.data.map((log: any) =>
            <LogView key={log.id} log={log} />
          )}
        </div>
      )}
    </Card>
  )
}

export default LogsCard
