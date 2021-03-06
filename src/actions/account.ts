import { THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'
import { CACHE_KEY } from 'utils/consts'
import { mergeRSAABase } from './rootAction'
import { RSAA } from 'redux-api-middleware'
import { serve } from 'relatives/services/constant'
import { Log, User } from './types'

// 登陆
export const login = (user: User, onResolved?: (isOk: boolean, errMsg?: string) => void) => ({ type: 'USER_LOGIN', user, onResolved })
export const loginSucceeded = (user: User) => ({ type: 'USER_LOGIN_SUCCEEDED', user })
export const loginFailed = (message: string) => ({ type: 'USER_LOGIN_FAILED', message })

// 登出
export const logout = () => ({ type: 'USER_LOGOUT' })
export const logoutSucceeded = () => { return ({ type: 'USER_LOGOUT_SUCCEEDED' }) }
export const logoutFailed = () => ({ type: 'USER_LOGOUT_FAILED' })

// 获取登陆信息
export const fetchLoginInfo = () => ({ type: 'USER_FETCH_LOGIN_INFO' })
export const fetchLoginInfoSucceeded = (user: User) => ({ type: 'USER_FETCH_LOGIN_INFO_SUCCEEDED', user })
export const fetchLoginInfoFailed = (message: string) => ({ type: 'USER_FETCH_LOGIN_INFO_FAILED', message })

// 注册
export const addUser = (user: User, onResolved: TCB) => ({ type: 'USER_ADD', user, onResolved })
export const addUserSucceeded = (user: User) => ({ type: 'USER_ADD_SUCCEEDED', user })
export const addUserFailed = (message: string) => ({ type: 'USER_ADD_FAILED', message })

// 删除用户
export const deleteUser = (id?: number) => ({ type: 'USER_DELETE', id })
export const deleteUserSucceeded = (id: number) => ({ type: 'USER_DELETE_SUCCEEDED', id })
export const deleteUserFailed = (id: number) => ({ type: 'USER_DELETE_FAILED', id })

// 获取用户列表
export const fetchUserCount = () => ({ type: 'USER_COUNT_FETCH' })
export const fetchUserCountSucceeded = (count: number) => ({ type: 'USER_COUNT_FETCH_SUCCEEDED', count })
export const fetchUserCountFailed = (message: string) => ({ type: 'USER_COUNT_FETCH_FAILED', message })
export const fetchUserList = ({ cursor, limit } = { cursor: '', limit: ''}) => ({ type: 'USER_LIST_FETCH', cursor, limit })
export const fetchUserListSucceeded = (users?: User) => ({ type: 'USER_LIST_FETCH_SUCCEEDED', users })
export const fetchUserListFailed = (message: string) => ({ type: 'USER_LIST_FETCH_FAILED', message })

// 获取用户设置
// export const fetchSetting = () => ({ type: 'SETTING_FETCH' })
// export const fetchSettingSucceeded = (setting) => ({ type: 'SETTING_FETCH_SUCCEEDED', setting })
// export const fetchSettingFailed = (message: string) => ({ type: 'SETTING_FETCH_FAILED', message })

// 修改用户设置
export const updateSetting = (setting: CACHE_KEY[]) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingSucceeded = (setting: CACHE_KEY[]) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingFailed = (message: string) => ({ type: 'SETTING_UPDATE', message })

// 获取用户通知
export const fetchNotificationList = () => ({ type: 'NOTIFICATION_LIST_FETCH' })
export const fetchNotificationListSucceeded = () => ({ type: 'NOTIFICATION_LIST_FETCH_SUCCEEDED' })
export const fetchNotificationListFailed = () => ({ type: 'NOTIFICATION_LIST_FETCH_Failed' })

// 阅读用户通知
export const readNotification = (id: number) => ({ type: 'NOTIFICATION_READ', id })
export const readNotificationSucceeded = (id: number) => ({ type: 'NOTIFICATION_READ_SUCCEEDED', id })
export const readNotificationFailed = (message: string) => ({ type: 'NOTIFICATION_READ_FAILED', message })

// 获取用户日志
export const fetchLogList = (
  { cursor, limit } = { cursor: '', limit: '' }
) => ({ type: 'LOG_LIST_FETCH', cursor, limit })
export const fetchLogListSucceeded = (logs?: Log) => ({ type: 'LOG_LIST_FETCH_SUCCEEDED', logs })
export const fetchLogListFailed = (message: string) => ({ type: 'LOG_LIST_FETCH_FAILED', message })

// 发送重设密码邮件
export const findpwd = (user: User, onResolved?: (isOk: boolean, errMsg?: string) => void) => ({ type: 'USER_FINDPWD', user, onResolved })
export const findpwdSucceeded = () => ({ type: 'USER_FINDPWD_SUCCEEDED' })
export const findpwdFailed = (message: string) => ({ type: 'USER_FINDPWD_FAILED', message })

// 用户通过邮件重设密码
export const resetpwd = (user: User, onResolved?: (isOk: boolean, errMsg: string) => void) => ({ type: 'USER_RESETPWD', user, onResolved })
export const resetpwdSucceeded = () => ({ type: 'USER_RESETPWD_SUCCEEDED' })
export const resetpwdFailed = (message: string) => ({ type: 'USER_RESETPWD_FAILED', message })
export type CHANGE_THEME = 'CHANGE_THEME'
export const CHANGE_THEME: CHANGE_THEME = 'CHANGE_THEME'
export type CHANGE_GUIDE = 'CHANGE_GUIDE'
export const CHANGE_GUIDE: CHANGE_GUIDE = 'CHANGE_GUIDE'

export const changeGuide = (guideOpen: boolean) => ({
  type: CHANGE_GUIDE,
  payload: guideOpen,
})

export const changeTheme = (themeId: THEME_TEMPLATE_KEY) => ({
  type: CHANGE_THEME,
  payload: themeId,
})

export type UPDATE_USER_SETTING_REQUEST = 'UPDATE_USER_SETTING_REQUEST'
export const UPDATE_USER_SETTING_REQUEST: UPDATE_USER_SETTING_REQUEST = 'UPDATE_USER_SETTING_REQUEST'

export type UPDATE_USER_SETTING_SUCCESS = 'UPDATE_USER_SETTING_SUCCESS'
export const UPDATE_USER_SETTING_SUCCESS: UPDATE_USER_SETTING_SUCCESS = 'UPDATE_USER_SETTING_SUCCESS'

export type UPDATE_USER_SETTING_FAILURE = 'UPDATE_USER_SETTING_FAILURE'
export const UPDATE_USER_SETTING_FAILURE: UPDATE_USER_SETTING_FAILURE = 'UPDATE_USER_SETTING_FAILURE'

export function updateUserSetting(key: CACHE_KEY, value: string) {
  return {
    [RSAA]: mergeRSAABase({
      endpoint: `${serve}/account/updateUserSetting/${key}`,
      method: 'POST',
      body: JSON.stringify(value ? { value } : {}),
      types: [UPDATE_USER_SETTING_REQUEST, UPDATE_USER_SETTING_SUCCESS, UPDATE_USER_SETTING_SUCCESS],
    }),
  }
}

export type DO_UPDATE_USER_SETTING = 'DO_UPDATE_USER_SETTING'
export const DO_UPDATE_USER_SETTING = 'DO_UPDATE_USER_SETTING'

export const doUpdateUserSetting = (key: CACHE_KEY, value: string, cb: TCB) => ({
  type: DO_UPDATE_USER_SETTING,
  payload: {
    cb,
    key,
    value,
  },
})

export interface DoUpdateUserSettingAction {
  type: DO_UPDATE_USER_SETTING
  payload: {
    cb: TCB
    key: CACHE_KEY
    value: string
  }
}

export type FETCH_USER_SETTINGS_REQUEST = 'FETCH_USER_SETTINGS_REQUEST'
export const FETCH_USER_SETTINGS_REQUEST: FETCH_USER_SETTINGS_REQUEST = 'FETCH_USER_SETTINGS_REQUEST'

export type FETCH_USER_SETTINGS_SUCCESS = 'FETCH_USER_SETTINGS_SUCCESS'
export const FETCH_USER_SETTINGS_SUCCESS: FETCH_USER_SETTINGS_SUCCESS = 'FETCH_USER_SETTINGS_SUCCESS'

export type FETCH_USER_SETTINGS_FAILURE = 'FETCH_USER_SETTINGS_FAILURE'
export const FETCH_USER_SETTINGS_FAILURE: FETCH_USER_SETTINGS_FAILURE = 'FETCH_USER_SETTINGS_FAILURE'

export function fetchUserSettings(keys: CACHE_KEY[]) {
  return {
    [RSAA]: mergeRSAABase({
      endpoint: `${serve}/account/fetchUserSettings`,
      method: 'POST',
      body: JSON.stringify({ keys }),
      types: [FETCH_USER_SETTINGS_REQUEST, FETCH_USER_SETTINGS_SUCCESS, FETCH_USER_SETTINGS_FAILURE],
    }),
  }
}

export type DO_FETCH_USER_SETTINGS = 'DO_FETCH_USER_SETTINGS'
export const DO_FETCH_USER_SETTINGS: DO_FETCH_USER_SETTINGS = 'DO_FETCH_USER_SETTINGS'

export function doFetchUserSettings(keys?: CACHE_KEY[], cb?: TCB) {
  return {
    type: DO_FETCH_USER_SETTINGS,
    payload: { keys, cb },
  }
}

export type UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST'
export const UPDATE_ACCOUNT_REQUEST: UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST'

export type UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS'
export const UPDATE_ACCOUNT_SUCCESS: UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS'

export type UPDATE_ACCOUNT_FAILURE = 'UPDATE_ACCOUNT_FAILURE'
export const UPDATE_ACCOUNT_FAILURE: UPDATE_ACCOUNT_FAILURE = 'UPDATE_ACCOUNT_FAILURE'

export const updateAccount = (payload: { fullname?: string; password?: string}) => ({
  [RSAA]: mergeRSAABase({
    endpoint: `${serve}/account/updateAccount`,
    method: 'POST',
    body: JSON.stringify(payload),
    types: [UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE],
  }),
})

export type DO_UPDATE_ACCOUNT = 'DO_UPDATE_ACCOUNT'
export const DO_UPDATE_ACCOUNT = 'DO_UPDATE_ACCOUNT'

export const doUpdateAccount = (params: {fullname?: string; password?: string}, cb: TCB) => ({
  type: DO_UPDATE_ACCOUNT,
  payload: {
    params,
    cb,
  },
})
