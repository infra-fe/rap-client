import { useTranslation } from 'react-i18next'
import React, { useState, MouseEventHandler } from 'react'
import { connect, Link, replace, moment } from '../../family'
import { serve } from '../../relatives/services/constant'
import RepositoryForm from './RepositoryForm'
import { useConfirm } from 'hooks/useConfirm'
import { GoRepo, GoPencil, GoPlug, GoTrashcan, GoPerson, GoOrganization } from 'react-icons/go'
import { RouterState } from 'connected-react-router'
import { RootState, User, Repository } from 'actions/types'
import { Card } from '@mui/material'
import { deleteRepository } from 'actions/repository'
// DONE 2.1 iconfont => octicons

interface Props {
  auth: User
  repository: Repository
  editor: string
  router: RouterState
  deleteRepository: typeof deleteRepository
  replace: typeof replace
}

function RepositoryCom(props: Props) {
  const { auth, repository, editor, router } = props
  const [open, setOpen] = useState(false)
  const confirm = useConfirm()
  const { t } = useTranslation()
  const handleDeleteRepository: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    const { repository, router, replace } = props
    const message = `${t('confirm delete repo')}『#${
      repository.id
    } ${repository.name}』${t('?')}`
    confirm({
      title: t('Confirm delete'),
      content: message,
    }).then(() => {
      const { deleteRepository } = props
      deleteRepository(repository.id, function() {
        const { pathname, hash, search } = router.location
        replace(pathname + hash + search)
      })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch(()=>{})
  }
  const { location } = router
  return (
    <Card className="Repository card">
      <div className="card-block">
        <div className="name">
          <GoRepo className="mr6 color-9" />
          <Link to={`${editor}?id=${repository.id}`}>{repository.name}</Link>
        </div>
        <div className="desc">{repository.description}</div>
        <div className="toolbar">
          <a
            href={`${serve}/app/plugin/${repository.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoPlug />
          </a>
          {/* 编辑权限：拥有者或者成员 */}
          {repository.canUserEdit ? (
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPencil />
            </span>
          ) : null}
          {open && <RepositoryForm
            title={t('Edit the repository')}
            open={open}
            onClose={() => setOpen(false)}
            repository={repository}
          />}

          {/* 删除权限：个人仓库 */}
          {repository.owner.id === auth.id ? (
            <Link
              to={location.pathname + location.search}
              onClick={handleDeleteRepository}
            >
              <GoTrashcan />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="card-block card-footer">
        {repository.organization ? (
          <span className="ownername">
            <GoOrganization /> {repository.organization.name}
          </span>
        ) : (
          <span className="ownername">
            <GoPerson /> {repository.owner.fullname}
          </span>
        )}
        <span className="fromnow">
          {moment(repository.updatedAt).fromNow()}{t(' update')}
        </span>
      </div>
    </Card>
  )
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = {
  deleteRepository,
  replace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryCom)
