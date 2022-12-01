import { THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'
import { POS_TYPE } from 'components/editor/InterfaceSummary'
import { RouterState } from 'connected-react-router'
export interface RootState {
  auth: User
  router: RouterState
  repository: Async<Repository>
  repositories: AsyncWithPager<Repository>
  organization: Async<Organization>
  organizations: AsyncWithPager<Organization>
  ownedRepositories: AsyncWithPager<Repository>
  ownedOrganizations: AsyncWithPager<Organization>
  joinedOrganizations: AsyncWithPager<Organization>
  joinedRepositories: AsyncWithPager<Repository>
  users: AsyncWithPager<User>
  interfaces: AsyncWithPager<Interface>

  counter: Counter
  analyticsRepositoriesCreated: Async<INumItem[]>
  analyticsRepositoriesUpdated: Async<INumItem[]>
  analyticsUsersActivation: Async<Array<{ userId: number; fullname: string; value: number }>>
  analyticsRepositoriesActivation: Async<Array<{ repositoryId: number; label: string; value: number }>>

  logs: AsyncWithPager<Log>
  loading: boolean
  message: IMessage
  userSettings: { [key: string]: string }
  userSettingsIsUpdating: boolean
  themeId: THEME_TEMPLATE_KEY
  guideOpen: boolean
  defaultVals: DefaultValue[]
  copyId: string | number | null
  tags: ITag[]
}

export interface Log extends ModelBase {
  type: string
  creatorId: number
  userId: number
  organizationId: number
  repositoryId: number
  moduleId: number
  interfaceId: number
  user: User
}

export interface DefaultValue extends ModelBase {
  name: string
  rule: string
  value: string
  repositoryId: number
}

export interface RepositoryVersion {
  versionName: string
  lockType?: string
  id: number
  updatedAt: number
  isMaster: boolean
}
export interface Organization extends ModelBase {
  name: string

  description?: string

  logo?: string

  /** true: 公开, false: 私有 */
  visibility?: boolean

  creatorId?: number

  ownerId?: number

  memberIds?: number[]

  members?: User[]

  owner?: User

  newOwner?: User
}

export interface ImportSwagger {
  version: number
  docUrl: string
  orgId?: number
  mode: string
  repositoryId?: number
  swagger?: string
  modId?: number
  cover?: number
  versionId?: number
}
export interface User extends ModelBase {
  fullname?: string
  email?: string
  empId?: string
  password?: string

  captcha?: string
  code?: string
  token?: string
}
export interface IConfig {
  serve: string
  keys: string[]
  session: {
    key: string
  }
}

export interface RepositoryFormData {
  id: number

  name: string

  description?: string

  basePath?: string

  logo?: string

  /** true: 公开, false: 私有 */
  visibility?: boolean

  creatorId?: number

  ownerId?: number

  organizationId?: number

  memberIds?: number[]

  members?: User[]

  owner?: User

  newOwner?: User

  collaborators?: Repository[]

  collaboratorIds?: string[]

  collaboratorIdstring?: string

  token?: string

  modules?: Module[]
}

export interface Repository extends ModelBase {
  name: string

  description: string

  basePath: string

  logo: string

  /** true: 公开, false: 私有 */
  visibility: boolean

  creatorId: number

  ownerId: number

  organizationId: number

  organization: Organization

  memberIds: number[]

  members: User[]

  token: string

  owner: User

  collaborators: Repository[]

  modules: Module[]

  collaboratorIds: string[]

  canUserEdit?: boolean

  version: RepositoryVersion

}

export interface Module {
  id: number

  name: string

  description?: string

  repositoryid?: number

  creatorId?: number

  priority: number

  interfaces?: Interface[]

  repository?: Repository

  repositoryId?: number

  versionId?: number
}

export interface Interface {
  id: number

  name: string

  url: string

  method: string

  description?: string

  moduleId?: number

  creatorId?: number

  lockerid?: number

  locker?: User

  repositoryId?: number

  repository?: Repository

  properties?: Property[]

  status?: number

  bodyOption?: string

  /** Is this API as a template? */
  isTmpl?: boolean

  /** For template selection */
  tmplId?: number

  tagIds?: number[]
  tags?: ITag[]
}

export interface ITag {
  id: number
  name: string
  level: string
  color?: string
  repositoryId?: number
}

export interface Property {
  id: number | string
  name: string
  description: string
  parentId: number | string
  interfaceId: number
  moduleId: number
  repositoryId: number
  scope: 'request' | 'response'
  value: string
  memory: boolean
  pos: POS_TYPE
  required?: boolean
  rule?: any
  type: string
  priority?: number
}

/**
 * Counter data used for dashboard page
 */
export interface Counter {
  /** eg-> 2.9.2 */
  version: string
  /** users count */
  users: number
  /** mock API invocation count */
  mock: number
}
