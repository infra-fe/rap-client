import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { RSortable } from '../utils'
import ModuleForm from './ModuleForm'
import { useSelector, useDispatch } from 'react-redux'
import { GoPackage } from 'react-icons/go'
import { deleteModule, sortModuleList } from '../../actions/module'
import { Module, Repository, RootState, User } from '../../actions/types'
import { Box } from '@mui/material'

interface ModuleBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  deleteModule: typeof deleteModule
  replace?: typeof replace
}
function ModuleBase(props: ModuleBaseProps) {
  const { mod } = props
  const router = useSelector((state: RootState) => state.router)
  const uri = StoreStateRouterLocationURI(router).removeSearch('itf')
  const selectHref = uri.setSearch('mod', mod!.id.toString()).href()

  return (
    <div className="Module clearfix">
      <Link to={selectHref} className="name">
        {mod.name}
      </Link>
    </div>
  )
}

const mapStateToModuleBaseProps = (state: any) => ({
  router: state.router,
})
const mapDispatchToModuleBaseProps = ({
  deleteModule,
  replace,
})

const ModuleWrap = connect(mapStateToModuleBaseProps, mapDispatchToModuleBaseProps)(ModuleBase)

interface ModuleListProps {
  mods?: Module[]
  mod?: Module
  repository: Repository
}

function ModuleList(props: ModuleListProps) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, mods = [], mod } = props
  const { t } = useTranslation()
  const handleSort = (_: any, sortable: any) => {
    dispatch(sortModuleList(sortable.toArray(), () => {
      /** empty */
    }))
  }
  return (
    <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
      <ul className="ModuleList clearfix">
        {mods.map((item: any) => (
          <Box
            component="li"
            key={item.id}
            sx={item.id === mod!.id ? (theme) => ({ borderColor: `${theme.palette.primary.main} #e1e4e8 transparent #e1e4e8 !important` }) : null}
            className={`${item.id === mod!.id ? 'active ' : ''} sortable `}
            data-id={item.id}
          >
            <ModuleWrap
              key={item.id}
              mod={item}
              active={item.id === mod!.id}
              repository={repository}
              auth={auth}
            />
          </Box>
        ))}
        {/* 编辑权限：拥有者或者成员 */}
        {repository.canUserEdit ? (
          <li>
            <span onClick={() => setOpen(true)} className="g-link">
              <GoPackage className="fontsize-14" /> {t('Create Module')}
            </span>
            <ModuleForm
              title={t('Create Module')}
              repository={repository}
              open={open}
              onClose={() => setOpen(false)}
            />
          </li>
        ) : null}
      </ul>
    </RSortable>
  )
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = ({
  replace,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleList)
