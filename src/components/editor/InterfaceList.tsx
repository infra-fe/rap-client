import { Box, Button, Tooltip } from '@mui/material'
import { useConfirm } from 'hooks/useConfirm'
import { MouseEventHandler, useState } from 'react'
import { Translation, useTranslation } from 'react-i18next'
import { GoLock, GoPencil, GoTrashcan } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteInterface, sortInterfaceList, unlockInterface } from '../../actions/interface'
import { Interface, Module, Repository, RootState, User } from '../../actions/types'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { getCurrentInterface } from '../../selectors/interface'
import { CustomScroll, RSortable, TagView } from '../utils'
import InterfaceForm from './InterfaceForm'
import './InterfaceList.sass'
import InterfaceTagSelect from './InterfaceTagSelect'

interface InterfaceBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  itf?: Interface
  curItf?: Interface
  serialNumber?: number
  deleteInterface: typeof deleteInterface
  replace?: typeof replace
  unlockInterface: typeof unlockInterface
}

function InterfaceBase(props: InterfaceBaseProps) {
  const { repository, mod, itf, curItf, unlockInterface, serialNumber } = props
  const auth = useSelector((state: RootState) => state.auth)
  const router = useSelector((state: RootState) => state.router)
  const history = useHistory()
  const selectHref = StoreStateRouterLocationURI(router).setSearch('itf', itf!.id.toString()).href()
  const [open, setOpen] = useState(false)
  const confirm = useConfirm()
  const { t } = useTranslation()
  const handleDeleteInterface: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    const message = `${t('Unrecoverable after the interface is deleted')}！\n${t(
      'Confirm delete'
    )}『#${itf!.id} ${itf!.name}』${t('?')}`
    confirm({
      title: t('Confirm delete'),
      content: message,
    }).then(() => {
      const { deleteInterface } = props
      deleteInterface(props.itf!.id, () => {
        // TODO:
      })
      const { pathname, hash, search } = router.location
      replace(pathname + hash + search)
    })
  }

  return (
    <div className="Interface clearfix">
      <span>
        <Link
          to={selectHref}
          onClick={(e) => {
            if (curItf?.locker?.id === auth.id) {
              e.preventDefault()
              confirm({
                content: t('switchConfirm'),
              }).then(() => {
                unlockInterface(curItf.id)
                history.push(selectHref)
              })
            } else {
              const top = document.querySelector<HTMLElement>('.InterfaceEditor')!.offsetTop - 10
              // 当接口列表悬浮时切换接口自动跳转到接口顶部
              if (window.scrollY > top) {
                window.scrollTo(0, top)
              }
            }
          }}
        >
          <div className="name">{`${serialNumber ? serialNumber + '.' : ''} ${itf!.name}`}</div>
          <Tooltip title={itf!.url} arrow={true}>
            <div className="url">
              <span className={`methodTag tag${itf!.method}`}>{itf!.method}</span>
              {itf!.url}
            </div>
          </Tooltip>
        </Link>
        {itf?.tags?.length ? <TagView tags={itf?.tags} style={{ marginTop: '5px' }} /> : null}
      </span>
      {repository.canUserEdit ? (
        <div className="toolbar">
          {itf!.locker ? (
            <span className="locked mr5">
              <GoLock />
            </span>
          ) : null}
          {!itf!.locker || itf!.locker.id === auth.id ? (
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPencil />
            </span>
          ) : null}
          <Translation>
            {(t) => (
              <InterfaceForm
                title={t('Edit Interface')}
                repository={repository}
                mod={mod}
                itf={itf}
                open={open}
                type="edit"
                onClose={() => setOpen(false)}
              />
            )}
          </Translation>
          {!itf!.locker ? (
            <Link to="" onClick={handleDeleteInterface}>
              <GoTrashcan />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
const mapStateToProps = (state: RootState) => ({
  curItf: getCurrentInterface(state),
  router: state.router,
})
const mapDispatchToProps = {
  replace,
  deleteInterface,
  unlockInterface,
}
const InterfaceWrap = connect(mapStateToProps, mapDispatchToProps)(InterfaceBase)

interface InterfaceListProps {
  itfs?: Interface[]
  itf?: any
  curItf: Interface
  mod: Module
  repository: Repository
  tagIds?: number[]
  onSelectTags?: (tagIds: number[]) => void
}
function InterfaceList(props: InterfaceListProps) {
  const [interfaceFormOpen, setInterfaceFormOpen] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, itf, itfs = [], mod, tagIds, onSelectTags } = props

  const handleSort = (_: any, sortable: any) => {
    dispatch(
      sortInterfaceList(sortable.toArray(), mod.id, () => {
        /** empty */
      })
    )
  }

  if (repository.modules.length === 0) {
    return <div style={{ height: 600 }}>{t('Please add the module')}</div>
  }

  return (
    <article className="InterfaceList">
      {repository.canUserEdit ? (
        <div className="header">
          <Button
            className="newIntf"
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={() => setInterfaceFormOpen(true)}
          >
            {t('Create Interface')}
          </Button>

          <InterfaceForm
            title={t('Create Interface')}
            repository={repository}
            mod={mod}
            open={interfaceFormOpen}
            onClose={() => setInterfaceFormOpen(false)}
          />
        </div>
      ) : null}

      <Box sx={{ marginBottom: '0.65rem' }}>
        <InterfaceTagSelect
          canUserEdit={repository?.canUserEdit}
          repositoryId={repository.id}
          tagIds={tagIds}
          onChange={onSelectTags}
        />
      </Box>
      {itfs.length ? (
        <Box
          className="scrollWrapper"
          sx={(theme) => ({
            border: `1px solid ${theme.palette.primary.main}`,
          })}
        >
          <CustomScroll>
            <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
              <ul className="body">
                {itfs.map((item: any, index: number) => (
                  <Box
                    component="li"
                    key={item.id}
                    sx={(theme) => ({
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      ...(item.id === itf!.id
                        ? {
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                        }
                        : {}),
                    })}
                    className="sortable"
                    data-id={item.id}
                  >
                    <InterfaceWrap
                      repository={repository}
                      mod={mod}
                      itf={item}
                      active={item.id === itf!.id}
                      auth={auth}
                      serialNumber={index + 1}
                    />
                  </Box>
                ))}
              </ul>
            </RSortable>
          </CustomScroll>
        </Box>
      ) : (
        <div className="alert alert-info">{t('No interface, new, please')}</div>
      )}
    </article>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(InterfaceList)
