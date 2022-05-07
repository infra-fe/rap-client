declare interface IConfig {
  serve: string
  keys: string[]
  session: {
    key: string
  }
}

declare interface IMessage {
  message: string
  type: MSG_TYPE
  timestamp: number
  duration?: number
}

/** normal callback */
declare type TCB = (isOk: boolean, data?: any, returnMsg?: string) => void


declare interface IPager {
  offset: number
  limit: number
  order?: TOrder
  orderBy?: string
  query?: string
  total?: number
  cursor?: number
}

declare interface IPagerList<T> {
  rows: T[]
  count: number
}

declare interface AnyDoAction {
  type: string
  payload: {
    cb?: TCB
    params: any
  }
}

declare type TCommonDoAction = {
  type: string
  payload: {
    isOk: true
    data?: any
    errMsg?: string
  } | TCommonError
}

declare type Async<T> = {
  data: T
  fetching: boolean
}


declare type AsyncWithPager<T> = {
  data: T[]
  fetching: boolean
  pagination: IPager
}

declare interface INumItem {
  value: number
  label: string
}

declare interface ModelBase {
  id?: number
  createdAt?: string
  deletedAt?: string
  updatedAt?: string
}
