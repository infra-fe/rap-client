import Family from './Family'
import Bundle from './Bundle'
import _PropTypes from 'prop-types'
import _URI from 'urijs'
import _moment from 'moment'
import { RouterState } from 'connected-react-router'
import { Store } from 'redux'
import { History } from 'history'
import MockJs from 'mockjs'
import 'moment/locale/zh-cn'
import 'moment/locale/en-sg'

export default Family
export { Bundle }

export const PropTypes = _PropTypes
export { render, findDOMNode } from 'react-dom' // ReactDOM
export { connect, Provider } from 'react-redux'
export { createStore, applyMiddleware, combineReducers, compose } from 'redux'
export { NavLink, Link, Redirect, Router, Route, Switch } from 'react-router-dom'
export { push, replace, go, goBack, goForward } from 'connected-react-router'
export { call, put, take, takeLatest } from 'redux-saga/effects'
export { delay } from 'redux-saga/effects'
export * as _ from 'lodash-es'
export const URI = _URI
export const store = Family.store as Store
export const history = Family.history as History
export const StoreStateRouterLocationURI = (router: RouterState) => {
  const { pathname, search, hash } = router.location
  return URI(pathname + search + hash)
}

export const Mock = MockJs
export const moment = _moment

export const MOMENT_LOCALE = {
  'zh' : 'zh-cn',
  'en' : 'en-sg',
}
