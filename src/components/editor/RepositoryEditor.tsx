import { Translation } from 'react-i18next'
import React, { Component } from 'react'
import { PropTypes, connect, Link, replace, _ } from '../../family'
import { serve } from '../../relatives/services/constant'
import { Spin } from '../utils'
import RepositoryForm from '../repository/RepositoryForm'
import RepositorySearcher from './RepositorySearcher'
import ModuleList from './ModuleList'
import InterfaceList from './InterfaceList'
import InterfaceEditor from './InterfaceEditor'
import Validator from '../validator/Validator'
import DuplicatedInterfacesWarning from './DuplicatedInterfacesWarning'
import { addRepository, updateRepository, clearRepository, fetchRepository } from '../../actions/repository'
import { addModule, updateModule, deleteModule, sortModuleList } from '../../actions/module'
import { addInterface, updateInterface, deleteInterface, lockInterface, unlockInterface } from '../../actions/interface'
import { addProperty, updateProperty, deleteProperty, updateProperties, sortPropertyList } from '../../actions/property'
import { GoRepo, GoVersions, GoPlug, GoDatabase, GoCode, GoLinkExternal, GoPencil, GoEllipsis } from 'react-icons/go'
import { FaHistory } from 'react-icons/fa'
import './RepositoryEditor.css'
import ExportPostmanForm from '../repository/ExportPostmanForm'
import ImportSwaggerRepositoryForm from '../repository/ImportSwaggerRepositoryForm'
import { RootState, Repository, User } from 'actions/types'
import DefaultValueModal from './DefaultValueModal'
import RapperInstallerModal from './RapperInstallerModal'
import HistoryLogDrawer from './HistoryLogDrawer'
import Joyride from 'react-joyride'
import { Typography } from '@mui/material'
import { doFetchUserSettings } from 'actions/account'
import Markdown from 'markdown-to-jsx'
import { CACHE_KEY, ENTITY_TYPE } from 'utils/consts'
import { RouterState } from 'connected-react-router'

// DONE 2.1 import Spin from '../utils/Spin'
// TODO 2.2 缺少测试器
// DONE 2.2 各种空数据下的视觉效果：空仓库、空模块、空接口、空属性
// TODO 2.1 大数据测试，含有大量模块、接口、属性的仓库

interface Props {
  guideOpen: boolean
  auth: User
  repository: Async<Repository>
  location: any
  onClearRepository: () => void
  replace: any
  router: RouterState
  doFetchUserSettings: typeof doFetchUserSettings
}

interface States {
  rapperInstallerModalOpen: boolean
  defaultValuesModalOpen: boolean
  historyLogDrawerOpen: boolean
  update: boolean
  exportPostman: boolean
  importSwagger: boolean
  openValidator: boolean
}

// 展示组件
class RepositoryEditor extends Component<Props, States> {
  static childContextTypes = {
    onAddRepository: PropTypes.func.isRequired,
    onUpdateRepository: PropTypes.func.isRequired,
    onAddModule: PropTypes.func.isRequired,
    onUpdateModule: PropTypes.func.isRequired,
    onDeleteModule: PropTypes.func.isRequired,
    onSortModuleList: PropTypes.func.isRequired,
    onAddInterface: PropTypes.func.isRequired,
    onUpdateInterface: PropTypes.func.isRequired,
    onDeleteInterface: PropTypes.func.isRequired,
    onLockInterface: PropTypes.func.isRequired,
    onUnlockInterface: PropTypes.func.isRequired,
    onAddProperty: PropTypes.func.isRequired,
    onUpdateProperty: PropTypes.func.isRequired,
    onUpdateProperties: PropTypes.func.isRequired,
    onDeleteProperty: PropTypes.func.isRequired,
    onSortPropertyList: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      update: false,
      exportPostman: false,
      rapperInstallerModalOpen: false,
      defaultValuesModalOpen: false,
      importSwagger: false,
      historyLogDrawerOpen: false,
      openValidator: false,
    }
  }

  getChildContext() {
    return _.pick(this.props, Object.keys(RepositoryEditor.childContextTypes))
  }

  changeDocumentTitle() {
    const repository = this.props.repository.data
    if (repository && repository.name) {
      document.title = `RAP2 ${repository.name}`
    }
  }

  componentDidUpdate() {
    this.changeDocumentTitle()
  }

  componentDidMount() {
    this.changeDocumentTitle()
    this.props.doFetchUserSettings([CACHE_KEY.GUIDE_20200714])
  }

  componentWillUnmount() {
    document.title = `RAP2`
  }

  render() {
    const { location: { params } } = this.props
    const { repository: repositoryAsync } = this.props
    if (!repositoryAsync.fetching && !repositoryAsync.data) {
      return (
        <Translation>{(t) => (
          <div className="p100 fontsize-30 text-center">
            {t('Corresponding to the repository was not found')}</div>
        )}
        </Translation>
      )
    }
    if (repositoryAsync.fetching || !repositoryAsync.data || !repositoryAsync.data.id) {
      return <Spin />
    }

    const repository: Repository = repositoryAsync.data
    if (repository.name) {
      document.title = `RAP2 ${repository.name}`
    }

    let mod =
      repository && repository.modules && repository.modules.length
        ? repository.modules.find((item: any) => item.id === +params.mod) || repository.modules[0]
        : null

    if (!(+params.mod > 0) && +params.itf > 0) {
      const tryMods = repository?.modules?.filter(m => m.interfaces.map(x => x.id).indexOf(+params.itf) > -1)
      if (tryMods && tryMods[0]) {
        mod = tryMods[0]
      }
    }

    const itf =
      mod?.interfaces && mod?.interfaces?.length
        ? mod?.interfaces?.find((item: any) => item.id === +params.itf) || mod?.interfaces[0]
        : {}

    const ownerlink = repository.organization
      ? `/organization/repository?organization=${repository.organization.id}`
      : `/repository/joined?user=${repository.owner.id}`

    return (
      <Translation>
        {(t) => (
          <article className="RepositoryEditor">
            <div className="header">
              <span className="title">
                <GoRepo className="mr6 color-9" />
                <Link to={`${ownerlink}`} className="g-link">
                  {repository.organization ? repository.organization.name : repository.owner.fullname}
                </Link>
                <span className="slash"> / </span>
                <span>{repository.name}</span>
              </span>
              <div className="toolbar">
                {/* 编辑权限：拥有者或者成员 */}

                {repository.canUserEdit ? (
                  <span className="g-link edit mr1" onClick={() => this.setState({ update: true })}>
                    <GoPencil /> {t('Edit')}
                  </span>
                ) : null}
                <RepositoryForm
                  open={this.state.update}
                  onClose={ok => {
                    ok && this.handleUpdate()
                    this.setState({ update: false })
                  }}
                  title={t('Edit the repository')}
                  repository={repository}
                />
                <a
                  href={`${serve}/app/plugin/${repository.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-link"
                >
                  <GoPlug /> {t('Plugin')}
                </a>
                <a
                  href={`${serve}/repository/get?id=${repository.id}&token=${repository.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-link"
                >
                  <GoDatabase /> {t(' Data')}
                </a>
                <span className="g-link edit mr1" onClick={() => this.setState({ importSwagger: true })}>
                  <GoLinkExternal /> {t('Import')}
                </span>
                <ImportSwaggerRepositoryForm
                  open={this.state.importSwagger}
                  onClose={ok => {
                    ok && this.handleUpdate()
                    this.setState({ importSwagger: false })
                  }}
                  repositoryId={repository.id}
                  orgId={(repository.organization || {}).id}
                  modId={+mod?.id || 0}
                  mode="manual"
                />
                <span className="g-link edit mr1" onClick={() => this.setState({ exportPostman: true })}>
                  <GoLinkExternal /> {t('Export')}
                </span>
                <ExportPostmanForm
                  title={t('Export')}
                  open={this.state.exportPostman}
                  repoId={repository.id}
                  repoToken={repository.token}
                  onClose={() => this.setState({ exportPostman: false })}
                />
                <span
                  className="g-link edit mr1"
                  onClick={() => this.setState({ defaultValuesModalOpen: true })}
                >
                  <GoEllipsis /> {t('Default')}
                </span>
                <span
                  className="g-link edit mr1 guide-1"
                  onClick={() => this.setState({ historyLogDrawerOpen: true })}
                >
                  <FaHistory /> {t('History')}
                </span>
                <DefaultValueModal
                  open={this.state.defaultValuesModalOpen}
                  handleClose={() => this.setState({ defaultValuesModalOpen: false })}
                  repositoryId={repository.id}
                />
                <HistoryLogDrawer
                  open={this.state.historyLogDrawerOpen}
                  onClose={() => this.setState({ historyLogDrawerOpen: false })}
                  entityId={repository?.id}
                  entityType={ENTITY_TYPE.REPOSITORY}
                />
                <span
                  className="g-link edit"
                  onClick={() => this.setState({ rapperInstallerModalOpen: true })}
                >
                  <GoCode /> Rapper
                </span>
                <RapperInstallerModal
                  open={this.state.rapperInstallerModalOpen}
                  handleClose={() => this.setState({ rapperInstallerModalOpen: false })}
                  repository={repository}
                />
              </div>
              <RepositorySearcher repository={repository} />
              <div className="desc"><Markdown>{repository.description || ''}</Markdown></div>
              {this.renderRelatedProjects()}
              <DuplicatedInterfacesWarning repository={repository} />
            </div>
            <div className="body">
              <ModuleList mods={repository.modules} repository={repository} mod={mod} />
              <div className="InterfaceWrapper">
                <InterfaceList itfs={mod?.interfaces || []} repository={repository} mod={mod} itf={itf} />
                <InterfaceEditor itf={itf} mod={mod} repository={repository}
                  onValidate={() => this.setState({ openValidator: true })} />
                <Validator open={this.state.openValidator} itf={itf} mod={mod} repository={repository}
                  onClose={() => this.setState({ openValidator: false })} />
              </div>
            </div>
            <Joyride
              continuous={true}
              scrollToFirstStep={true}
              showProgress={true}
              showSkipButton={true}
              run={this.props.guideOpen}
              locale={{
                skip: t('skip'),
                next: t('The next step'),
                back: t('The previous step'),
                last: t('complete'),
              }}
              steps={[
                {
                  title: t('Historical records online'),
                  disableBeacon: true,
                  content: <Typography variant="h6">{t('Now you can view the project change history!')}</Typography>,
                  placement: 'top',
                  target: '.guide-1',
                },
                {
                  title: t('Historical records online'),
                  disableBeacon: true,
                  content: <Typography variant="h6">{t('You can also check the records of all changes to the specified interface.')}</Typography>,
                  placement: 'top',
                  target: '.guide-2',
                }, {
                  title: t('Skin custom online'),
                  disableBeacon: true,
                  content: <Typography variant="h6">{t('In system preferences, choose a favorite color! Such as green?')}</Typography>,
                  placement: 'top',
                  target: '.guide-3',
                },
              ]}
            />
          </article>
        )}
      </Translation>
    )
  }
  renderRelatedProjects() {
    const { repository } = this.props
    const { collaborators } = repository.data
    return (
      <Translation>
        {(t) => (
          <div className="RelatedProjects">
            {collaborators &&
              Array.isArray(collaborators) &&
              collaborators.map(collab => (
                <div className="CollabProject Project" key={`collab-${collab.id}`}>
                  <span className="title">
                    <GoVersions className="mr5" />
                    {t('synergy')}
                  </span>
                  <Link to={`/repository/editor?id=${collab.id}`}>{collab.name}</Link>
                </div>
              ))}
          </div>
        )}
      </Translation>
    )
  }
  handleUpdate = () => {
    const { pathname, hash, search } = this.props.router.location
    this.props.replace(pathname + search + hash)
  }
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  guideOpen: state.guideOpen,
  auth: state.auth,
  repository: state.repository,
  router: state.router,
})
const mapDispatchToProps = {
  onFetchRepository: fetchRepository,
  onAddRepository: addRepository,
  onUpdateRepository: updateRepository,
  onClearRepository: clearRepository,
  onAddModule: addModule,
  onUpdateModule: updateModule,
  onDeleteModule: deleteModule,
  onSortModuleList: sortModuleList,
  onAddInterface: addInterface,
  onUpdateInterface: updateInterface,
  onDeleteInterface: deleteInterface,
  onLockInterface: lockInterface,
  onUnlockInterface: unlockInterface,
  onAddProperty: addProperty,
  onUpdateProperty: updateProperty,
  onUpdateProperties: updateProperties,
  onDeleteProperty: deleteProperty,
  onSortPropertyList: sortPropertyList,
  replace,
  doFetchUserSettings,
}
export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditor)
