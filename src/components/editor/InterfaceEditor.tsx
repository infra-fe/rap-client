import { fetchInterface, lockInterface, unlockInterface, updateCopyId, updateInterface } from 'actions/interface'
import { updateProperties } from 'actions/property'
import { Property, Repository, RootState } from 'actions/types'
import _ from 'lodash'
import { ProviderContext, withSnackbar } from 'notistack'
import { Component, createContext } from 'react'
import { Translation, useTranslation } from 'react-i18next'
import { fetchRepository } from '../../actions/repository'
import Spin from '../../components/utils/Spin'
import { connect, PropTypes } from '../../family'
import i18n from '../../i18n'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary from './InterfaceSummary'
import MoveInterfaceForm from './MoveInterfaceForm'
import PropertyList from './PropertyList'
import PropertyModal, { PropertyModalProps } from './PropertyModal'


export const PropertyModalContext = createContext<{toggleModal: (config: PropertyModalProps) => void}>(null)

export const RequestPropertyList = (props: any) => {
  const { t } = useTranslation()
  return <PropertyList scope="request" title={t('Request Parameters')} label={t('Request')} {...props} />
}
export const ResponsePropertyList = (props: any) => {
  const { t } = useTranslation()
  return <PropertyList scope="response" title={t('Response Content')} label={t('Response')} {...props} />
}
interface InterfaceEditorProps extends ProviderContext {
  copyId: string | number | null
  auth: any
  itf: any
  mod: any
  repository: Repository
  lockInterface: typeof lockInterface
  fetchInterface: typeof fetchInterface
  unlockInterface: typeof unlockInterface
  updateInterface: typeof updateInterface
  updateProperties: typeof updateProperties
  onValidate?: () => void
  updateCopyId: typeof updateCopyId
}

type InterfaceEditorState = {
  summaryState: any
  itf: any
  properties: Property[]
  editable: boolean
  moveInterfaceDialogOpen: boolean
  modalConfig: PropertyModalProps
}
// TODO 2.x 参考 MySQL Workbench 的字段编辑器
// TODO 2.x 支持复制整个接口到其他模块、其他项目
class InterfaceEditor extends Component<InterfaceEditorProps, InterfaceEditorState> {
  static childContextTypes = {
    handleUnlockInterface: PropTypes.func.isRequired,
    handleSaveInterfaceAndProperties: PropTypes.func.isRequired,
    handleMoveInterface: PropTypes.func.isRequired,
    handleAddMemoryProperty: PropTypes.func.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired,
    handleChangeAllProperty: PropTypes.func.isRequired,
    handleCopyProperty: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      ...InterfaceEditor.mapPropsToState(props),
      summaryState: {
        bodyOption: props.bodyOption,
      },
      moveInterfaceDialogOpen: false,
      modalConfig: {},
    }
    this.summaryStateChange = this.summaryStateChange.bind(this)
  }
  static mapPropsToState(prevProps: any, prevStates: any = {}) {
    const { auth, itf } = prevProps
    const editable = !!(itf.locker && itf.locker.id === auth.id)
    return {
      ...prevStates,
      itf,
      // 编辑模式下不替换 properties
      properties:
        editable && prevStates.properties
          ? prevStates.properties
          : itf.properties?.map((property: any) => ({ ...property })),
      editable,
    }
  }
  getChildContext() {
    return _.pick(this, Object.keys(InterfaceEditor.childContextTypes))
  }

  summaryStateChange(summaryState: any) {
    this.setState({ summaryState })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.itf.id === prevState.itf.id &&
      nextProps.itf.updatedAt === prevState.itf.updatedAt &&
      nextProps.itf.locker === prevState.itf.locker &&
      prevState.properties !== undefined
    ) {
      return null
    }
    return InterfaceEditor.mapPropsToState(nextProps, prevState)
  }

  fetchInterfaceProperties() {
    // 发现接口信息没有 properties 就发起请求
    if (this.state.properties === undefined) {
      this.props.fetchInterface(this.state.itf.id, () => {
        // TODO:
      })
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleShortKey)
    this.fetchInterfaceProperties()
  }

  componentDidUpdate() {
    this.fetchInterfaceProperties()
  }
  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleShortKey)
  }
  handleShortKey = _.throttle((e) => {
    e.stopPropagation()
    const { ctrlKey, key } = e
    if (ctrlKey) {
      switch (key) {
        case 'e':
          if (!this.state.editable) {
            this.handleEditInterface()
          } else {
            this.handleUnlockInterface()
          }
          break
        case 's':
          if (this.state.editable) {
            this.handleSaveInterfaceAndProperties(e, i18n['t'])
          }
          break
      }
    }
  }, 500)
  render() {
    const { auth, repository, mod, onValidate } = this.props
    const { editable, itf } = this.state
    const { id, locker, bodyOption } = this.state.itf
    if (!id) {
      return null
    }
    return (
      <article className="InterfaceEditor">
        <Translation>
          {(t) => (
            <InterfaceEditorToolbar
              locker={locker}
              auth={auth}
              repository={repository}
              editable={editable}
              itf={itf}
              moveInterface={this.handleMoveInterface}
              handleEditInterface={this.handleEditInterface}
              handleMoveInterface={this.handleMoveInterface}
              handleSaveInterfaceAndProperties={(e) => this.handleSaveInterfaceAndProperties(e, t)}
              handleUnlockInterface={this.handleUnlockInterface}
              onValidate={onValidate}
            />
          )}</Translation>
        <InterfaceSummary
          repository={repository}
          mod={mod}
          itf={itf}
          active={true}
          editable={editable}
          stateChangeHandler={this.summaryStateChange}
          handleChangeInterface={this.handleChangeInterface}
        />

        {this.state.properties ? (
          <PropertyModalContext.Provider value={{
            toggleModal: (config: PropertyModalProps) => {
              this.setState({modalConfig: config})
            },
          }}>
            <RequestPropertyList
              properties={this.state.properties}
              auth={auth}
              editable={editable}
              repository={repository}
              mod={mod}
              interfaceId={itf.id}
              itf={itf}
              bodyOption={bodyOption}
              posFilter={this.state.summaryState.posFilter}
              handleChangeProperty={this.handleChangeProperty}
              handleChangeAllProperty={this.handleChangeAllProperty}
              handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
              handleCopyProperty={this.handleCopyProperty}
              handleUnlockInterface={this.handleUnlockInterface}
            />
            <ResponsePropertyList
              properties={this.state.properties}
              auth={auth}
              editable={editable}
              repository={repository}
              itf={itf}
              mod={mod}
              interfaceId={itf.id}
              handleChangeProperty={this.handleChangeProperty}
              handleChangeAllProperty={this.handleChangeAllProperty}
              handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
              handleCopyProperty={this.handleCopyProperty}
              handleUnlockInterface={this.handleUnlockInterface}
            />
            <PropertyModal {...this.state.modalConfig} />
          </PropertyModalContext.Provider>
        ) : (
          <Spin />
        )}

        {this.state.moveInterfaceDialogOpen && (
          <Translation>
            {(t) => (
              <MoveInterfaceForm
                title={t('Move/Copy interface')}
                mod={mod}
                repository={repository}
                itfId={itf.id}
                open={this.state.moveInterfaceDialogOpen}
                onClose={() => this.setState({ moveInterfaceDialogOpen: false })}
              />
            )}
          </Translation>
        )}
      </article>
    )
  }
  handleAddMemoryProperty = (property: any, cb: any) => {
    this.handleAddMemoryProperties([property], cb)
  }
  handleAddMemoryProperties = (properties: any, cb: any) => {

    properties.forEach((item: any) => {
      if (item.memory === undefined) {
        item.memory = true
      }
      if (item.id === undefined) {
        item.id = _.uniqueId('memory-')
      }
    })
    const nextState = { properties: [...this.state.properties, ...properties] }
    this.setState(nextState, () => {
      if (cb) {
        cb(properties)
      }
    })
  }
  handleDeleteMemoryProperty = (property: any, cb: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1)

      // 清除后代属性
      const deletedParentIds = [property.id]
      for (let index = 0; index < properties.length; index++) {
        if (deletedParentIds.indexOf(properties[index].parentId) !== -1) {
          deletedParentIds.push(properties[index].id)
          properties.splice(index--, 1)
          index = 0 // 强制从头开始查找，避免漏掉后代属性
        }
      }
      if (this.props.copyId === property.id) {
        this.props.updateCopyId(null)
      }
      this.setState({ properties }, () => {
        cb && cb()
      })
    }
  }
  handleChangeProperty = (property: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      this.setState({ properties })
    }
  }
  handleChangeAllProperty = (properties) => {
    this.setState({ properties })
  }
  handleChangeInterface = (newItf: any) => {
    this.setState({
      itf: {
        ...this.state.itf,
        ...newItf,
      },
    })
  }
  handleSaveInterfaceAndProperties = (e: any, t: any) => {
    e.preventDefault()
    const { itf } = this.state
    const { updateProperties, updateInterface } = this.props
    if (!itf.name.trim()) {
      this.props.enqueueSnackbar(t('msg1'), { variant: 'warning' })
      return
    }

    if (!itf.url.trim()) {
      this.props.enqueueSnackbar(t('msg2'), { variant: 'warning' })
      return
    }

    if (itf.url.substring(0, 4) !== 'http' && itf.url[0] !== '/') {
      this.props.enqueueSnackbar(t('msg3'), { variant: 'warning' })
      return
    }

    // 判断参数命名冲突
    const pMap: { [key: string]: number } = {}
    const getPKey = (p: Property) => `${p.name}|${p.parentId}|${p.scope}`
    for (const p of this.state.properties) {
      if (!p.name.trim()) {
        this.props.enqueueSnackbar(`${t('msg4')}...${p.description ? `${t('describe as')}：${p.description}` : ''}`, { variant: 'warning' })
        return
      }
      p.name = p.name.trim()
      const key = getPKey(p)
      if (pMap[key]) {
        pMap[key]++
      } else {
        pMap[key] = 1
      }
      if (pMap[key] > 1) {
        this.props.enqueueSnackbar(`${t('parameter')}${p.name}${t('name conflict')}，${t('msg5')}`, { variant: 'warning' })
        return
      }
    }

    updateInterface(
      {
        id: itf.id,
        name: itf.name.trim(),
        url: itf.url.trim(),
        method: itf.method,
        status: itf.status,
        description: itf.description,
        isTmpl: itf.isTmpl,
        tagIds: itf.tagIds || itf.tags.map(v => v.id) || [],
      },
      () => {
        /** empty */
      }
    )
    updateProperties(this.state.itf.id, this.state.properties, this.state.summaryState, () => {
      this.handleUnlockInterface()
    })
  }
  handleMoveInterface = () => {
    this.setState({
      moveInterfaceDialogOpen: true,
    })
  }
  handleMoveInterfaceSubmit = () => {
    /** empty */
  }
  handleEditInterface = () => {
    const { lockInterface, fetchInterface } = this.props
    fetchInterface(this.state.itf.id, (res: any) => {
      if (!res.locker) {
        lockInterface(res.id)
      }
    })
  }
  handleUnlockInterface = () => {
    const { itf, unlockInterface } = this.props
    unlockInterface(itf.id)
  }
  handleCopyProperty = (id: number) => {
    this.props.updateCopyId(id)
  }
}

const mapStateToProps = (state: RootState) => ({
  copyId: state.copyId,
  auth: state.auth,
  fetchRepository,
})

const mapDispatchToProps = {
  lockInterface,
  fetchInterface,
  unlockInterface,
  updateProperties,
  updateInterface,
  updateCopyId,
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(InterfaceEditor))
