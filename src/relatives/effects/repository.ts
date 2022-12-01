import { RootState } from 'actions/types'
import { StoreStateRouterLocationURI } from 'family'
import { call, put, select } from 'redux-saga/effects'
import * as RepositoryAction from '../../actions/repository'
import { fetchDefaultValsFailed, IFetchDefaultValsAction, IInitVersionAction, IRefreshTokenAction, IUpdateDefaultValsAction } from '../../actions/repository'
import RepositoryService from '../services/Repository'
import RepositoryVersionService from '../services/Version'

//
export function* fetchRepositoryCount(action: any) {
  try {
    const count = yield call(RepositoryService.fetchRepositoryCount, action)
    yield put(RepositoryAction.fetchRepositoryCountSucceeded(count))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryCountFailed(e.message))
  }
}
export function* fetchRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchRepositoryList, action)
    yield put(RepositoryAction.fetchRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryListFailed(e.message))
  }
}
export function* addRepository(action: any) {
  try {
    const repository = yield call(RepositoryService.addRepository, action.repository)
    yield put(RepositoryAction.addRepositorySucceeded(repository))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.addRepositoryFailed(e.message))
  }
}
export function* deleteRepository(action: any) {
  try {
    const count = yield call(RepositoryService.deleteRepository, action.id)
    yield put(RepositoryAction.deleteRepositorySucceeded(count))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.deleteRepositoryFailed(e.message))
  }
}
export function* updateRepository(action: any) {
  try {
    const r = action.repository
    const acceptedKeys = ['creatorId', 'organizationId', 'memberIds', 'id', 'collaboratorIds',
      'description', 'ownerId', 'visibility', 'name', 'basePath']
    const params: any = {}
    acceptedKeys.forEach(x => {
      params[x] = r[x]
    })
    yield call(RepositoryService.updateRepository, params)
    yield put(RepositoryAction.updateRepositorySucceeded(params))
    yield put(RepositoryAction.fetchRepository({ id: params.id }))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.updateRepositoryFailed(e.message))
  }
}

export function* importRepository(action: any) {
  try {
    const res = yield call(RepositoryService.importRepository, action.data)
    if (res.isOk) {
      yield put(RepositoryAction.importRepositorySucceeded())
    } else {
      yield put(RepositoryAction.importRepositoryFailed(res.message))
    }
    if (action.onResolved) { action.onResolved(res) }
  } catch (e) {
    yield put(RepositoryAction.importRepositoryFailed(e.message))
  }
}
export function* importSwaggerRepository(action: any) {
  try {
    const res = yield call(RepositoryService.importSwaggerRepository, action.data)
    if (res.isOk) {
      yield put(RepositoryAction.importSwaggerRepositorySucceeded())
    } else {
      yield put(RepositoryAction.importSwaggerRepositoryFailed(res.message))
    }
    if (action.onResolved) { action.onResolved(res) }
  } catch (e) {
    yield put(RepositoryAction.importSwaggerRepositoryFailed(e.message))
  }
}

export function* fetchRepository(action: any) {
  try {
    const router = yield select((state: RootState) => state.router)
    const uri = StoreStateRouterLocationURI(router)
    const params = uri.search(true)
    const repository = yield call(
      RepositoryService.fetchRepository as any,
      action.repository || action.id,
      params.token,
      params.versionId
    )
    yield put(RepositoryAction.fetchRepositorySucceeded(repository))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryFailed(e.message))
  }
}

export function* refreshRepository() {
  // 刷新仓库和当前的接口
  const repositoryId = yield select(
    (state: RootState) => state.repository && state.repository.data && state.repository.data.id
  )
  yield put(RepositoryAction.fetchRepository({ id: repositoryId }))
}

export function* handleRepositoryLocationChange(action: any) {
  const repositoryId = yield select(
    (state: RootState) => state.repository && state.repository.data && state.repository.data.id
  )
  const version = yield select(
    (state: RootState) => state.repository && state.repository.data && state.repository.data.version && state.repository.data.version
  )

  if (
    Number(action.id) !== repositoryId ||
    (version && ((!action.versionId && !version?.isMaster) || (action.versionId && Number(action.versionId) !== version?.id)))
  ) {
    // 切换仓库
    yield put(RepositoryAction.fetchRepository(action))
  }
}

export function* fetchOwnedRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchOwnedRepositoryList, action)
    yield put(RepositoryAction.fetchOwnedRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchOwnedRepositoryListFailed(e.message))
  }
}

export function* fetchJoinedRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchJoinedRepositoryList, action)
    yield put(RepositoryAction.fetchJoinedRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchJoinedRepositoryListFailed(e.message))
  }
}

export function* fetchDefaultVals(action: IFetchDefaultValsAction) {
  try {
    const result = yield call(RepositoryService.fetchDefaultVals, action.payload)
    yield put(RepositoryAction.fetchDefaultValsSucceeded(result))
  } catch (e) {
    yield put(fetchDefaultValsFailed({ message: e.message }))
  }
}

export function* updateDefaultVals(action: IUpdateDefaultValsAction) {
  try {
    yield call(RepositoryService.updateDefaultVals, action.payload)
    yield put(RepositoryAction.updateDefaultValsSucceeded())
  } catch (e) {
    yield put(RepositoryAction.updateDefaultValsFailed({ message: e.message }))
  }
}

export function* refreshToken(action: IRefreshTokenAction) {
  try {
    const payload = yield call(RepositoryService.refreshToken, action.id)
    if (payload.token) {
      yield put(RepositoryAction.refreshTokenSucceeded(payload))
      action?.onResolved(payload)
    } else {
      yield put(RepositoryAction.refreshTokenFailed(payload))
    }
  } catch (e) {
    yield put(RepositoryAction.refreshTokenFailed({ message: e.message }))
    action?.onRejected()
  }
}

export function* initVersion(action: IInitVersionAction) {
  try {
    const payload = yield call(RepositoryVersionService.initVersion, action.id)
    if (payload) {
      yield put(RepositoryAction.initVersionSucceeded(payload))
    } else {
      yield put(RepositoryAction.initVersionFailed(payload))
    }
    action?.onResolved(payload)
  } catch (e) {
    yield put(RepositoryAction.initVersionFailed({ message: e.message }))
    action?.onRejected()
  }
}
