import { IDefaultVal } from 'components/editor/DefaultValueModal'
import { ImportSwagger, RepositoryVersion } from './types'

export const addRepository = (repository: any, onResolved: () => void) => ({ type: 'REPOSITORY_ADD', repository, onResolved })
export const addRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_ADD_SUCCEEDED', repository })
export const addRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_ADD_FAILED', message })

export const importRepository = (data: any, onResolved: () => void) => ({ type: 'REPOSITORY_IMPORT', onResolved, data })
export const importRepositorySucceeded = () => ({ type: 'REPOSITORY_IMPORT_SUCCEEDED' })
export const importRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_IMPORT_FAILED', message })

export const importSwaggerRepository = (data: ImportSwagger, onResolved: (res: any) => void) => ({ type: 'REPOSITORY_IMPORT_SWAGGER', onResolved, data })
export const importSwaggerRepositorySucceeded = () => ({ type: 'REPOSITORY_IMPORT_SUCCEEDED_SWAGGER' })
export const importSwaggerRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_IMPORT_FAILED_SWAGGER', message })

export const updateRepository = (repository: any, onResolved: () => void) => ({ type: 'REPOSITORY_UPDATE', repository, onResolved })
export const updateRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_UPDATE_SUCCEEDED', repository })
export const updateRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_UPDATE_FAILED', message })

export const deleteRepository = (id: number, onResolved?: () => void) => ({ type: 'REPOSITORY_DELETE', id, onResolved })
export const deleteRepositorySucceeded = (id: number) => ({ type: 'REPOSITORY_DELETE_SUCCEEDED', id })
export const deleteRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_DELETE_FAILED', message })

export const fetchRepository = ({ id, repository }: any) => ({ type: 'REPOSITORY_FETCH', id, repository })
export const fetchRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_FETCH_SUCCEEDED', repository })
export const fetchRepositoryFailed = (message: string) => ({ type: 'REPOSITORY_FETCH_FAILED', message })

export const refreshRepository = () => ({ type: 'REPOSITORY_REFRESH' })
export const repositoryLocationChange = ({ id, repository, versionId }: any) => ({ type: 'REPOSITORY_LOCATION_CHANGE', id, repository, versionId })

export const clearRepository = () => ({ type: 'REPOSITORY_CLEAR' })

export const fetchRepositoryCount = () => ({ type: 'REPOSITORY_COUNT_FETCH' })
export const fetchRepositoryCountSucceeded = (count: number) => ({ type: 'REPOSITORY_COUNT_FETCH_SUCCEEDED', count })
export const fetchRepositoryCountFailed = (message: string) => ({ type: 'REPOSITORY_COUNT_FETCH_FAILED', message })

export const fetchRepositoryList = ({ user, organization, name, cursor, limit } = { user: '', organization: '', name: '', cursor: '', limit: '' }) => ({ type: 'REPOSITORY_LIST_FETCH', user, organization, name, cursor, limit })
export const fetchRepositoryListSucceeded = (repositories: any) => ({ type: 'REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchRepositoryListFailed = (message: string) => ({ type: 'REPOSITORY_LIST_FETCH_FAILED', message })
export const fetchOwnedRepositoryList = (
  { user, name } = { user: '', name: '' }
) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH', user, name })
export const fetchOwnedRepositoryListSucceeded = (repositories: any) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchOwnedRepositoryListFailed = (message: string) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchJoinedRepositoryList = (
  { user, name } = { user: '', name: '' }
) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH', user, name })
export const fetchJoinedRepositoryListSucceeded = (repositories: any) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchJoinedRepositoryListFailed = (message: string) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchDefaultVals = (id: number) => ({ type: 'DEFAULT_VALS_FETCH', payload: { id } })
export const fetchDefaultValsSucceeded = (data: IDefaultVal[]) => ({ type: 'DEFAULT_VALS_SUCCEEDED', payload: { data } })
export const fetchDefaultValsFailed = (payload: { message: string }) => ({ type: 'DEFAULT_VALS_FAILED', payload })

export type IFetchDefaultValsAction = ReturnType<typeof fetchDefaultVals>

export const updateDefaultVals = (id: number, data: IDefaultVal[]) => ({ type: 'UPDATE_DEFAULT_VALS_FETCH', payload: { id, data } })
export const updateDefaultValsSucceeded = () => ({ type: 'UPDATE_DEFAULT_VALS_SUCCEEDED' })
export const updateDefaultValsFailed = (payload: { message: string }) => ({ type: 'UPDATE_DEFAULT_VALS_FAILED', payload })

export type IUpdateDefaultValsAction = ReturnType<typeof updateDefaultVals>

export const refreshToken = (id: number, onResolved?: ({id, token}) => void, onRejected?: () => void) => ({ type: 'REFRESH_REPOSITORY_TOKEN', id, onResolved, onRejected })
export const refreshTokenSucceeded = (payload: {token: string}) => ({ type: 'REFRESH_REPOSITORY_TOKEN_SUCCEEDED', payload })
export const refreshTokenFailed = (payload: {message: string}) => ({ type: 'REFRESH_REPOSITORY_TOKEN_FAILED', payload })

export type IRefreshTokenAction = ReturnType<typeof refreshToken>


export const initVersion = (id: number, onResolved?: (data: RepositoryVersion) => void, onRejected?: () => void) => ({ type: 'INIT_REPOSITORY_VERSION', id, onResolved, onRejected })
export const initVersionSucceeded = (payload: {data: RepositoryVersion}) => ({ type: 'INIT_REPOSITORY_VERSION_SUCCEEDED', payload })
export const initVersionFailed = (payload: {message: string}) => ({ type: 'INIT_REPOSITORY_VERSION_FAILED', payload })

export type IInitVersionAction = ReturnType<typeof initVersion>
