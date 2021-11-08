import { useTranslation, Translation } from 'react-i18next'
import React, { useState, MouseEventHandler, CSSProperties } from 'react'
import { connect, Link, StoreStateRouterLocationURI, replace } from '../../family'
import { sortInterfaceList, deleteInterface, unlockInterface } from '../../actions/interface'
import { deleteModule } from '../../actions/module'
import { Module, Repository, RootState, Interface, User } from '../../actions/types'
import { RSortable, CustomScroll } from '../utils'
import InterfaceForm from './InterfaceForm'
import { useConfirm } from 'hooks/useConfirm'
import { GoPencil, GoTrashcan, GoLock } from 'react-icons/go'
import { getCurrentInterface } from '../../selectors/interface'
import { Button, ButtonGroup, makeStyles, Theme } from '@material-ui/core/'
import ModuleForm from './ModuleForm'
import MoveModuleForm from './MoveModuleForm'
import { useSelector, useDispatch } from 'react-redux'
import './InterfaceList.css'

interface InterfaceBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  itf?: Interface
  curItf?: Interface
  deleteInterface: typeof deleteInterface
  replace?: typeof replace
  unlockInterface: typeof unlockInterface
}

function InterfaceBase(props: InterfaceBaseProps) {
  const { repository, mod, itf, curItf, unlockInterface } = props
  const auth = useSelector((state: RootState) => state.auth)
  const router = useSelector((state: RootState) => state.router)
  const selectHref = StoreStateRouterLocationURI(router)
    .setSearch('itf', itf!.id.toString())
    .href()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const handleDeleteInterface: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    const message = `${t('Unrecoverable after the interface is deleted')}！\n${t('Confirm delete')}『#${itf!.id} ${itf!.name}』${t('?')}`
    if (window.confirm(message)) {
      const { deleteInterface } = props
      deleteInterface(props.itf!.id, () => {
        // TODO:
      })
      const { pathname, hash, search } = router.location
      replace(pathname + hash + search)
    }
  }

  return (
    <div className="Interface clearfix">
      <span>
        <Link
          to={selectHref}
          onClick={e => {
            if (
              curItf &&
              curItf.locker
            ) {
              if (!window.confirm(t('switchConfirm'))) {
                e.preventDefault()
              } else {
                unlockInterface(curItf.id)
              }
            } else {
              const top = document.querySelector<HTMLElement>('.InterfaceEditor')!.offsetTop - 10
              // 当接口列表悬浮时切换接口自动跳转到接口顶部
              if (window.scrollY > top) {
                window.scrollTo(0, top)
              }
            }
          }}
        >
          <div className="name">{itf!.name}</div>
          <div className="url">{itf!.url}</div>
        </Link>
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
                title={t('Modify Interface')}
                repository={repository}
                mod={mod}
                itf={itf}
                open={open}
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
}
const useStyles = makeStyles(({ palette }: Theme) => ({
  interface: {
    border: `1px solid ${palette.primary.main}`,
  },
  interfaceActive: {
    borderLeft: `3px solid ${palette.primary.main}`,
  },
  li: {
    borderBottom: `1px solid ${palette.primary.main}`,
  },
}))
function InterfaceList(props: InterfaceListProps) {
  const [interfaceFormOpen, setInterfaceFormOpen] = useState(false)
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [moveModuleFormOpen, setMoveModuleFormOpen] = useState(false)
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, itf, itfs = [], mod } = props
  const classes = useStyles()
  const { t } = useTranslation()
  const dangerousStyles: CSSProperties = { color: '#CC0000', fontWeight: 'bold', fontSize: 16, display: 'inline', margin: '0 4px' } // 给眼神不太好的同学专门的设计

  const handleDeleteModule: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const message = (
      <div style={{ width: 800 }}>
        <div>
          <div style={dangerousStyles}>{t('Module')}</div>
          {t('Deleted after')}
          <div style={dangerousStyles}>{t('unrecoverable')}</div>
          {t('! And will be deleted')}
          <div style={dangerousStyles}>{t('The relevant interface')}</div>！</div>
        <div>
          {t('Confirm delete')}『#{mod.id} ${mod.name}』{ t('?')}
        </div>
      </div>
    )
    confirm({
      title: t('Confirm delete module'),
      content: message,
    }).then(() => {
      dispatch(
        deleteModule(
          props.mod.id,
          () => {
            // TODO:
          },
          repository!.id
        )
      )
    })
  }

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
            variant="outlined"
            fullWidth={true}
            color="primary"
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

          <ButtonGroup fullWidth={true} size="medium">
            <Button variant="outlined" color="primary" onClick={() => setModuleFormOpen(true)}>
              {t('modify module')}
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setMoveModuleFormOpen(true)}>
              {t('Move/copy module')}
            </Button>
            <Button variant="outlined" color="primary" onClick={handleDeleteModule}>
              {t('Delete module')}
            </Button>
          </ButtonGroup>

          {moduleFormOpen && (
            <ModuleForm
              title={t('modify module')}
              module={mod}
              repository={repository}
              open={moduleFormOpen}
              onClose={() => setModuleFormOpen(false)}
            />
          )}

          {moveModuleFormOpen && (
            <MoveModuleForm
              title={t('Move/copy module')}
              mod={mod}
              repository={repository}
              open={moveModuleFormOpen}
              onClose={() => setMoveModuleFormOpen(false)}
            />
          )}
        </div>
      ) : null}
      {itfs.length ? (
        <div className={`scrollWrapper ${classes.interface}`}>
          <CustomScroll>
            <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
              <ul className="body">
                {itfs.map((item: any) => (
                  <li
                    key={item.id}
                    className={`${item.id === itf!.id ? classes.interfaceActive : ''} sortable ${classes.li}`}
                    data-id={item.id}
                  >
                    <InterfaceWrap
                      repository={repository}
                      mod={mod}
                      itf={item}
                      active={item.id === itf!.id}
                      auth={auth}
                    />
                  </li>
                ))}
              </ul>
            </RSortable>
          </CustomScroll>
        </div>
      ) : (
        <div className="alert alert-info">{t('No interface, new, please')}</div>
      )}
    </article>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(InterfaceList)
