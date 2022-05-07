import { call, put } from 'redux-saga/effects'
import * as SceneAction from '../../actions/scene'
import EditorService from '../services/Editor'

export function* addScene(action: any) {
  try {
    const payload = yield call(EditorService.addScene, action.scene)
    yield put(SceneAction.addSceneSucceeded(payload))
    action?.onResolved(payload)
  } catch (e) {
    yield put(SceneAction.addSceneFailed(e.message))
    action?.onRejected()
  }
}

export function* updateScene(action: any) {
  try {
    const result = yield call(EditorService.updateScene, action.scene)
    yield put(SceneAction.updateSceneSucceeded(result))
    action?.onResolved(result)
  } catch (e) {
    yield put(SceneAction.updateSceneFailed(e.message))
    action?.onRejected()
  }
}

export function* deleteScene(action: any) {
  try {
    yield call(EditorService.deleteScene, action.id)
    yield put(SceneAction.deleteSceneSucceeded({
      id: action.id,
    }))
    action?.onResolved()
  } catch (e) {
    yield put(SceneAction.deleteSceneFailed(e.message))
  }
}

export function* fetchSceneList(action: any) {
  try {
    if (!action.interfaceId) {
      return
    }
    const payload = yield call(EditorService.fetchSceneList, action.interfaceId)
    yield put(SceneAction.fetchSceneListSucceeded(payload))
    action?.onResolved(payload)
  } catch (e) {
    yield put(SceneAction.fetchSceneListFailed(e.message))
    action?.onRejected()
  }
}

export function* fetchScene(action: any) {
  try {
    if (!action.id) {
      return
    }
    const payload = yield call(EditorService.fetchScene, action.id)
    yield put(SceneAction.fetchSceneSucceeded(payload))
    action?.onResolved(payload)
  } catch (e) {
    yield put(SceneAction.fetchSceneFailed(e.message))
    action?.onRejected()
  }
}
