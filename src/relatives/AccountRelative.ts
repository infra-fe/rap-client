import { call, put, select, take } from 'redux-saga/effects'
import * as AccountAction from '../actions/account'
import * as CommonAction from '../actions/common'
import AccountService from './services/Account'
import { StoreStateRouterLocationURI, replace, push } from '../family'
import { RootState } from '../actions/types'
import { THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'
import { CHANGE_THEME, CHANGE_GUIDE, DoUpdateUserSettingAction, updateUserSetting, UPDATE_USER_SETTING_SUCCESS, DO_UPDATE_USER_SETTING, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE, doFetchUserSettings } from '../actions/account'
import { AnyAction } from 'redux'
import { createCommonDoActionSaga } from './effects/commonSagas'
import { CACHE_KEY } from 'utils/consts'

const relatives = {
  reducers: {
    userSettings(state: RootState['userSettings'] = {}, action: any) {
      switch (action.type) {
        case AccountAction.FETCH_USER_SETTINGS_SUCCESS: {
          if (action.payload.isOk) {
            return {
              ...state,
              ...action.payload.data,
            }
          }
          break
        }
      }
      return state
    },
    userSettingsIsUpdating(state: boolean = false, action: any) {
      switch (action.type) {
        case AccountAction.UPDATE_USER_SETTING_REQUEST:
        case AccountAction.FETCH_USER_SETTINGS_REQUEST:
          return true
        case AccountAction.UPDATE_USER_SETTING_FAILURE:
        case AccountAction.UPDATE_USER_SETTING_SUCCESS:
        case AccountAction.FETCH_USER_SETTINGS_FAILURE:
        case AccountAction.FETCH_USER_SETTINGS_SUCCESS:
          return false
      }
      return state
    },
    themeId(state: THEME_TEMPLATE_KEY = THEME_TEMPLATE_KEY.INDIGO, action: any) {
      switch (action.type) {
        case CHANGE_THEME:
          return action.payload

        default:
          return state
      }
    },
    guideOpen(state: boolean = false, action: any) {
      switch (action.type) {
        case CHANGE_GUIDE:
          return action.payload

        default:
          return state
      }
    },
    loading(state: boolean = false, action: any) {
      switch (action.type) {
        case 'INTERFACE_LOCK':
        case 'INTERFACE_UNLOCK':
        case 'REPOSITORY_UPDATE':
        case 'PROPERTIES_UPDATE':
          return true
        case 'INTERFACE_LOCK_SUCCEEDED':
        case 'INTERFACE_LOCK_FAILED':
        case 'INTERFACE_UNLOCK_SUCCEEDED':
        case 'INTERFACE_UNLOCK_FAILED':
        case 'REPOSITORY_UPDATE_SUCCEEDED':
        case 'REPOSITORY_UPDATE_FAILED':
        case 'PROPERTIES_UPDATE_SUCCEEDED':
        case 'PROPERTIES_UPDATE_FAILED':
          return false
      }
      return state
    },
    auth(state: any = {}, action: any) {
      switch (action.type) {
        case AccountAction.findpwdSucceeded().type:
        case AccountAction.findpwdFailed('').type:
        case AccountAction.loginSucceeded({}).type:
        case AccountAction.fetchLoginInfoSucceeded({}).type:
          return action.user && action.user.id ? action.user : {}
        case AccountAction.loginFailed('').type:
        case AccountAction.logoutSucceeded().type:
        case AccountAction.logoutFailed().type:
        case AccountAction.fetchLoginInfoFailed('').type:
          return {}
        default:
          return state
      }
    },
    user(state: any = {}, action: any) {
      switch (action.type) {
        case AccountAction.findpwdSucceeded().type:
        case AccountAction.findpwdFailed('').type:
        case AccountAction.loginSucceeded({}).type:
        case AccountAction.fetchLoginInfoSucceeded({}).type:
          return action.user && action.user.id ? action.user : {}
        case AccountAction.loginFailed('').type:
        case AccountAction.logoutSucceeded().type:
        case AccountAction.logoutFailed().type:
        case AccountAction.fetchLoginInfoFailed('').type:
          return {}
        default:
          return state
      }
    },
    users(
      state: any = {
        data: [],
        pagination: { total: 0, limit: 100, cursor: 1 },
      },
      action: any
    ) {
      switch (action.type) {
        case '...':
          return state
        case AccountAction.addUserSucceeded({}).type:
          return {
            data: [...state.data, action.user],
            pagination: state.pagination,
          }
        case AccountAction.fetchUserCountSucceeded(0).type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination, total: action.count },
          }
        case AccountAction.fetchUserListSucceeded().type:
          return action.users
        default:
          return state
      }
    },
  },
  sagas: {
    *[AccountAction.DO_FETCH_USER_SETTINGS](action: ReturnType<typeof doFetchUserSettings>) {
      const { keys, cb } = action.payload
      yield put(AccountAction.fetchUserSettings(keys) as AnyAction)
      const resultAction = yield take(AccountAction.FETCH_USER_SETTINGS_SUCCESS)
      cb && cb(true, resultAction.payload)
    },
    *[AccountAction.FETCH_USER_SETTINGS_SUCCESS](action: any) {
      const { data } = action.payload
      if (data) {
        if ('THEME_ID' in data) {
          const themeId = data.THEME_ID
          yield put(AccountAction.changeTheme(themeId))
        }
        if ('GUIDE_20200714' in data) {
          const guide = data.GUIDE_20200714
          if (guide !== '1') {
            yield put(AccountAction.changeGuide(true))
            yield put(updateUserSetting(CACHE_KEY.GUIDE_20200714, '1') as AnyAction)
          }
        }
      }
    },
    *[CommonAction.refresh().type]() {
      const router = yield select((state: RootState) => state.router)
      const uri = StoreStateRouterLocationURI(router)
      yield put(replace(uri.href()))
    },
    *[AccountAction.fetchLoginInfo().type]() {
      try {
        const user = yield call(AccountService.fetchLoginInfo)
        if (user.id) {
          yield put(AccountAction.fetchLoginInfoSucceeded(user))
        }
      } catch (e) {
        yield put(AccountAction.fetchLoginInfoFailed(e.message))
      }
    },
    *[AccountAction.addUser(null, null).type](action: any) {
      try {
        const user = yield call(AccountService.addUser, action.user)
        let isOk = false
        if (user && user.id) {
          isOk = true
          yield put(AccountAction.addUserSucceeded(user))
          try {
            const user = yield call(AccountService.fetchLoginInfo)
            if (user.id) {
              yield put(AccountAction.fetchLoginInfoSucceeded(user))
            }
          } catch (e) {
            yield put(AccountAction.fetchLoginInfoFailed(e.message))
          }
          yield put(push('/'))
        } else {
          yield put(AccountAction.addUserFailed('注册失败'))
        }
        if (action.onResolved) {
          action.onResolved(isOk)
        }
      } catch (e) {
        yield put(AccountAction.addUserFailed(e.message))
      }
    },
    *[AccountAction.login({}).type](action: any) {
      const user = yield call(AccountService.login, action.user)
      if (user && user?.errMsg === undefined) {
        yield put(AccountAction.loginSucceeded(user))
        action.onResolved && action.onResolved(true)
      } else {
        yield put(AccountAction.loginFailed(undefined))
        action.onResolved && action.onResolved(false, user?.errMsg)
      }
    },
    *[AccountAction.logout().type]() {
      try {
        yield call(AccountService.logout)
        yield put(AccountAction.logoutSucceeded())
        yield put(push('/account/login'))
      } catch (e) {
        yield put(AccountAction.logoutFailed())
      }
    },
    *[AccountAction.deleteUser().type](action: any) {
      try {
        const count = yield call(AccountService.deleteUser, action.id)
        yield put(AccountAction.deleteUserSucceeded(count))
      } catch (e) {
        yield put(AccountAction.deleteUserFailed(e.message))
      }
    },
    *[AccountAction.fetchUserCount().type](action: any) {
      try {
        const count = yield call(AccountService.fetchUserCount as any, action)
        yield put(AccountAction.fetchUserCountSucceeded(count))
      } catch (e) {
        yield put(AccountAction.fetchUserCountFailed(e.message))
      }
    },
    *[AccountAction.fetchUserList().type](action: any) {
      try {
        const users = yield call(AccountService.fetchUserList, action)
        yield put(AccountAction.fetchUserListSucceeded(users))
      } catch (e) {
        yield put(AccountAction.fetchUserListFailed(e.message))
      }
    },
    *[AccountAction.findpwd({}).type](action: any) {
      try {
        const result = yield call(AccountService.findpwd, action.user)
        if (result.errMsg) {
          throw new Error(result.errMsg)
        }
        yield put(AccountAction.findpwdSucceeded())
        action.onResolved && action.onResolved(true)
      } catch (e) {
        yield put(AccountAction.findpwdFailed(e.message))
        action.onResolved && action.onResolved(false, e.message)
      }
    },
    *[AccountAction.resetpwd({}).type](action: any) {
      try {
        const result = yield call(AccountService.resetpwd, action.user)
        if (result.errMsg) {
          throw new Error(result.errMsg)
        }
        yield put(AccountAction.resetpwdSucceeded())
        action.onResolved && action.onResolved(true)
      } catch (e) {
        yield put(AccountAction.resetpwdFailed(e.message))
        action.onResolved && action.onResolved(false, e.message)
      }
    },
    *[DO_UPDATE_USER_SETTING](action: DoUpdateUserSettingAction) {
      const { key, value, cb } = action.payload
      yield put(updateUserSetting(key, value) as AnyAction)
      const opAction = yield take(UPDATE_USER_SETTING_SUCCESS)
      cb && cb(opAction.payload.isOk)
    },
    *[AccountAction.DO_UPDATE_ACCOUNT](action: ReturnType<typeof AccountAction.doUpdateAccount>) {
      yield createCommonDoActionSaga(AccountAction.updateAccount, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE)(action)
    },
  },
  listeners: {
    '/account': [AccountAction.fetchUserList],
  },
}

export default relatives
