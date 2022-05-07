import { IRSAA } from 'redux-api-middleware'
import { put, take } from 'redux-saga/effects'
import { AnyAction } from 'redux'

export function createCommonDoActionSaga(
  fetchActionCreator: (params: any) => { [x: string]: IRSAA },
  fetchSuccessActionType: string,
  _fetchErrorActionType?: string,
  hideSuccessMsg?: boolean,
  msg?: string
) {
  return function*(action: AnyDoAction) {
    const { cb, params } = action.payload
    yield put(fetchActionCreator(params) as AnyAction)
    const retAction: TCommonDoAction = yield take(fetchSuccessActionType)
    const isOk = retAction.payload.isOk
    let returnMsg = isOk? `${msg || '操作成功！'}${retAction.payload.errMsg || ''}` : `操作失败: ${retAction.payload.errMsg}`
    if (hideSuccessMsg) {
      returnMsg = ''
    }
    cb && cb(isOk, isOk ? retAction.payload.data : null, returnMsg)
  }
}
