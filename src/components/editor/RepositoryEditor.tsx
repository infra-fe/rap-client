import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Box, Collapse, Typography } from '@mui/material'
import { doFetchUserSettings } from 'actions/account'
import { Interface, Repository, RootState, User } from 'actions/types'
import VersionSelect from 'components/RepoSettings/VersionSelect'
import { RouterState } from 'connected-react-router'
import _ from 'lodash'
import Markdown from 'markdown-to-jsx'
import { Component } from 'react'
import { Translation } from 'react-i18next'
import { FaHistory } from 'react-icons/fa'
import {
  GoCode,
  GoDatabase,
  GoEllipsis,
  GoGear,
  GoLinkExternal,
  GoPencil,
  GoPlug,
  GoRepo,
  GoVersions,
} from 'react-icons/go'
import Joyride from 'react-joyride'
import { CACHE_KEY, ENTITY_TYPE } from 'utils/consts'
import { formatDateTime } from 'utils/DateUtility'
import {
  addInterface,
  deleteInterface,
  lockInterface,
  unlockInterface,
  updateInterface,
} from '../../actions/interface'
import { addModule, deleteModule, sortModuleList, updateModule } from '../../actions/module'
import {
  addProperty,
  deleteProperty,
  sortPropertyList,
  updateProperties,
  updateProperty,
} from '../../actions/property'
import {
  addRepository,
  clearRepository,
  fetchRepository,
  updateRepository,
} from '../../actions/repository'
import { connect, Link, PropTypes, replace, StoreStateRouterLocationURI } from '../../family'
import { serve } from '../../relatives/services/constant'
import SettingsModal from '../RepoSettings/Settings'
import ExportPostmanForm from '../repository/ExportPostmanForm'
import ImportSwaggerRepositoryForm from '../repository/ImportSwaggerRepositoryForm'
import RepositoryForm from '../repository/RepositoryForm'
import { Spin } from '../utils'
import CollapseButton from '../utils/CollapseUtil'
import Validator from '../validator/Validator'
import DefaultValueModal from './DefaultValueModal'
import DuplicatedInterfacesWarning from './DuplicatedInterfacesWarning'
import HistoryLogDrawer from './HistoryLogDrawer'
import InterfaceEditor from './InterfaceEditor'
import InterfaceList from './InterfaceList'
import ModuleList from './ModuleList'
import ModuleOperation from './ModuleOperation'
import RapperInstallerModal from './RapperInstallerModal'
import './RepositoryEditor.sass'
import RepositorySearcher from './RepositorySearcher'
// DONE 2.1 import Spin from '../utils/Spin'
// TODO 2.2 缺少测试器
// DONE 2.2 各种空数据下的视觉效果：空仓库、空模块、空接口、空属性
// TODO 2.1 大数据测试，含有大量模块、接口、属性的仓库
const REPO_DESC_FOLD_KEY = 'RepoDescFold'
const MAX_LINE = 4
const MAX_STR = 400
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
  settingsModalOpen: boolean
  historyLogDrawerOpen: boolean
  update: boolean
  exportPostman: boolean
  importSwagger: boolean
  openValidator: boolean
  repoDescFold: boolean
  modDescFold: boolean
  tagIds: number[]
  opVersion: boolean
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
      settingsModalOpen: false,
      importSwagger: false,
      historyLogDrawerOpen: false,
      openValidator: false,
      repoDescFold: localStorage.getItem(REPO_DESC_FOLD_KEY) === 'true',
      modDescFold: true,
      tagIds: [],
      opVersion: false,
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
    const {
      location: { params },
    } = this.props
    const { repository: repositoryAsync } = this.props
    if (!repositoryAsync.fetching && !repositoryAsync.data) {
      return (
        <Translation>
          {(t) => (
            <div className="p100 fontsize-30 text-center">
              {t('Sorry, you have no access to visit this data')}
            </div>
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

    const { mod: modId, itf: itfId } = params

    let mod = null
    if (repository?.modules?.length) {
      // 根据模块ID进行匹配，如果没有模块ID，则去第一个模块
      mod = repository.modules.find((item) => item.id === +modId) || repository.modules[0]

      if (+modId <= 0 && +itfId > 0) {
        // 如果模块ID无效，尝试使用接口ID进行修正
        const tryMods = repository.modules.filter((m) => {
          const itfIds = m.interfaces.map((x) => x.id)
          return itfIds.includes(+params.itf)
        })
        if (tryMods?.[0]) {
          mod = tryMods[0]
        }
      }
    }

    const itfs = filterItfsByTags(mod?.interfaces, this.state.tagIds)

    let itf = {}
    if (itfs?.length) {
      itf = itfs.find((item) => item.id === +itfId) || itfs[0]
    }

    const ownerlink = repository.organization
      ? `/organization/repository?organization=${repository.organization.id}`
      : `/repository/joined?user=${repository.owner.id}`
    const desc = repository.description || ''
    const needFoldDesc = desc.length > MAX_STR || desc.split('\n').length > MAX_LINE
    const handleSwitchVersion = (v) => {
      if (v) {
        const selectHref = StoreStateRouterLocationURI(window as any)
          .setSearch('versionId', v.id.toString())
          .href()
        this.props.replace(selectHref)
      }
    }
    const handleDeleteVersion = (v) => {
      const vId = repository?.version?.id
      if (vId !== v) {
        this.setState({ opVersion: !this.state.opVersion })
      } else {
        const deleteHref = StoreStateRouterLocationURI(window as any)
          .removeQuery('versionId')
          .href()
        this.props.replace(deleteHref)
      }
    }
    return (
      <Translation>
        {(t) => (
          <article className="RepositoryEditor">
            <div className="header">
              <span className="title">
                <GoRepo className="mr6 color-9" />
                <Link to={`${ownerlink}`} className="g-link">
                  {repository.organization
                    ? repository.organization.name
                    : repository.owner.fullname}
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
                  onClose={(ok) => {
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
                  href={`${serve}/repository/get?id=${repository.id}&token=${repository.token}${
                    repository?.version?.id ? `&versionId=${repository.version.id}` : ''
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-link"
                >
                  <GoDatabase /> {t(' Data')}
                </a>
                {repository.canUserEdit ? (
                  <span
                    className="g-link edit mr1"
                    onClick={() =>
                      this.setState({
                        importSwagger: true,
                      })
                    }
                  >
                    <GoLinkExternal /> {t('Import')}
                  </span>
                ) : null}
                <ImportSwaggerRepositoryForm
                  open={this.state.importSwagger}
                  onClose={(ok) => {
                    ok && this.handleUpdate()
                    this.setState({ importSwagger: false })
                  }}
                  versionId={repository?.version?.id}
                  repositoryId={repository.id}
                  versionName={repository?.version?.versionName}
                  orgId={(repository.organization || {}).id}
                  modId={+mod?.id || 0}
                  mode="manual"
                />
                <span
                  className="g-link edit mr1"
                  onClick={() => this.setState({ exportPostman: true })}
                >
                  <GoLinkExternal /> {t('Export')}
                </span>
                <ExportPostmanForm
                  title={t('Export')}
                  open={this.state.exportPostman}
                  repoId={repository.id}
                  repoToken={repository.token}
                  onClose={() => this.setState({ exportPostman: false })}
                  versionId={repository?.version?.id}
                />
                {repository.canUserEdit ? (
                  <span
                    className="g-link edit mr1"
                    onClick={() =>
                      this.setState({
                        defaultValuesModalOpen: true,
                      })
                    }
                  >
                    <GoEllipsis /> {t('Default')}
                  </span>
                ) : null}
                <span
                  className="g-link edit mr1 guide-1"
                  onClick={() =>
                    this.setState({
                      historyLogDrawerOpen: true,
                    })
                  }
                >
                  <FaHistory /> {t('History')}
                </span>
                <DefaultValueModal
                  open={this.state.defaultValuesModalOpen}
                  handleClose={() =>
                    this.setState({
                      defaultValuesModalOpen: false,
                    })
                  }
                  repositoryId={repository.id}
                />
                <HistoryLogDrawer
                  open={this.state.historyLogDrawerOpen}
                  onClose={() =>
                    this.setState({
                      historyLogDrawerOpen: false,
                    })
                  }
                  entityId={repository?.id}
                  entityType={ENTITY_TYPE.REPOSITORY}
                  versionId={repository?.version?.id}
                />
                <span
                  className="g-link edit mr1"
                  onClick={() =>
                    this.setState({
                      rapperInstallerModalOpen: true,
                    })
                  }
                >
                  <GoCode /> Rapper
                </span>
                <RapperInstallerModal
                  open={this.state.rapperInstallerModalOpen}
                  handleClose={() =>
                    this.setState({
                      rapperInstallerModalOpen: false,
                    })
                  }
                  repository={repository}
                />
                {repository.canUserEdit ? (
                  <span
                    className="g-link edit"
                    onClick={() =>
                      this.setState({
                        settingsModalOpen: true,
                      })
                    }
                  >
                    <GoGear /> {t('Settings')}
                  </span>
                ) : null}
                <SettingsModal
                  id={repository.id}
                  token={repository.token}
                  version={repository.version}
                  open={this.state.settingsModalOpen}
                  onClose={(refresh?: boolean) => {
                    if (refresh) {
                      window.location.reload()
                    }
                    this.setState({ settingsModalOpen: false })
                  }}
                  onAddVersion={() => {
                    this.setState({ opVersion: !this.state.opVersion })
                  }}
                  onDeleteVersion={handleDeleteVersion}
                />
              </div>
              <Box
                sx={{
                  position: 'absolute',
                  top: '1.3rem',
                  right: '1.3rem',
                  left: 'auto',
                  display: 'flex',
                }}
              >
                <RepositorySearcher repository={repository} />
              </Box>
              {repository.version && (
                <Box sx={{ mr: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                  {t('Version')}
                  <a
                    href="https://github.com/infra-fe/rap-client/wiki/Repository-Version-Mangement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HelpOutlineOutlinedIcon
                      sx={{ fontSize: '16px', color: '#3f51b5', cursor: 'pointer', margin: '2px' }}
                    />
                  </a>
                  <span style={{ marginRight: '5px' }}>: </span>
                  <VersionSelect
                    initial={repository?.version?.versionName}
                    width={200}
                    size="small"
                    variant="standard"
                    repositoryId={repository.id}
                    onChange={handleSwitchVersion}
                    opVersion={this.state.opVersion}
                  />
                  {repository?.version?.updatedAt && (
                    <span style={{ marginLeft: '10px' }}>
                      Last updated time: {formatDateTime(repository?.version?.updatedAt || '')}
                    </span>
                  )}
                </Box>
              )}
              {repository.basePath && (
                <div className="basePath">
                  {t('BasePath')}
                  <a
                    href="https://github.com/infra-fe/rap-client/wiki/BathPath"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HelpOutlineOutlinedIcon
                      sx={{ fontSize: '16px', color: '#3f51b5', cursor: 'pointer', margin: '2px' }}
                    />
                  </a>
                  <span style={{ marginRight: '5px' }}>: </span>
                  <span className="baseUrl">{repository.basePath}</span>
                </div>
              )}
              <div className="desc">
                {needFoldDesc ? (
                  <>
                    <CollapseButton
                      fold={this.state.repoDescFold}
                      setFold={this.handleRepoDescFold}
                    />
                    {this.state.repoDescFold && <span>{desc.split('\n')[0]}...</span>}
                    <Collapse in={!this.state.repoDescFold}>
                      <Markdown>{desc}</Markdown>
                    </Collapse>
                  </>
                ) : (
                  <Markdown>{desc}</Markdown>
                )}
              </div>
              {this.renderRelatedProjects()}
              <DuplicatedInterfacesWarning repository={repository} />
            </div>
            <div className="body">
              <ModuleList mods={repository.modules} repository={repository} mod={mod} />
              {mod && (
                <div className="moduleDesc">
                  <span className="mr1">
                    {t('Interface Count')}: {mod.interfaces.length}
                  </span>
                  <CollapseButton
                    fold={this.state.modDescFold}
                    setFold={(value) =>
                      this.setState({
                        modDescFold: value,
                      })
                    }
                  />
                  <ModuleOperation repository={repository} mod={mod} />
                  <Collapse in={!this.state.modDescFold}>
                    <Markdown>{mod.description || ''}</Markdown>
                  </Collapse>
                </div>
              )}
              <div className="InterfaceWrapper">
                <InterfaceList
                  itfs={itfs}
                  repository={repository}
                  mod={mod}
                  itf={itf}
                  tagIds={this.state.tagIds}
                  onSelectTags={(tagIds) => this.setState({ tagIds: tagIds || [] })}
                />
                <InterfaceEditor
                  itf={itf}
                  mod={mod}
                  repository={repository}
                  onValidate={() => this.setState({ openValidator: true })}
                />
                <Validator
                  open={this.state.openValidator}
                  itf={itf as Interface}
                  mod={mod}
                  repository={repository}
                  onClose={() => this.setState({ openValidator: false })}
                />
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
                  content: (
                    <Typography variant="h6">
                      {t('Now you can view the project change history!')}
                    </Typography>
                  ),
                  placement: 'top',
                  target: '.guide-1',
                },
                {
                  title: t('Historical records online'),
                  disableBeacon: true,
                  content: (
                    <Typography variant="h6">
                      {t(
                        'You can also check the records of all changes to the specified interface.'
                      )}
                    </Typography>
                  ),
                  placement: 'top',
                  target: '.guide-2',
                },
                {
                  title: t('Skin custom online'),
                  disableBeacon: true,
                  content: (
                    <Typography variant="h6">
                      {t('In system preferences, choose a favorite color! Such as green?')}
                    </Typography>
                  ),
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
              collaborators.map((collab) => (
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
  handleRepoDescFold = (value) => {
    localStorage.setItem(REPO_DESC_FOLD_KEY, value)
    this.setState({ repoDescFold: value })
  }
  handleUpdate = () => {
    const { pathname, hash, search } = this.props.router.location
    this.props.replace(pathname + search + hash)
  }
}

function filterItfsByTags(itfs: Interface[], tagIds: number[]): Interface[] {
  if (!itfs?.length) {
    return []
  }
  if (!tagIds?.length) {
    return itfs
  }

  const newList = itfs.filter((itf) => {
    const { tags } = itf

    if (!tags?.length) {
      return false
    }

    return tags.some((tag) => tagIds.includes(tag.id))
  })

  return newList || []
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
