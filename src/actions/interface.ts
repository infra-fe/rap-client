import { ITag } from 'actions/types'
export const addInterface = (itf: any, onResolved: (res: any) => void) => ({ type: 'INTERFACE_ADD', interface: itf, onResolved })
export const addInterfaceSucceeded = (payload: any) => ({ type: 'INTERFACE_ADD_SUCCEEDED', payload })
export const addInterfaceFailed = (message: string) => ({ type: 'INTERFACE_ADD_FAILED', message })

export const fetchInterface = (id: number, onResolved: (res: any) => void) => ({ type: 'INTERFACE_FETCH', id, onResolved })
export const fetchInterfaceSucceeded = (payload: any) => ({ type: 'INTERFACE_FETCH_SUCCEEDED', payload })
export const fetchInterfaceFailed = (message: string) => ({ type: 'INTERFACE_FETCH_FAILED', message })

export const updateInterface = (itf: any, onResolved: (res: any) => void) => ({ type: 'INTERFACE_UPDATE', interface: itf, onResolved })
export const updateInterfaceSucceeded = (payload: any) => ({ type: 'INTERFACE_UPDATE_SUCCEEDED', payload })
export const updateInterfaceFailed = (message: string) => ({ type: 'INTERFACE_UPDATE_FAILED', message })

export const moveInterface = (params: any, onResolved: () => void) => ({ type: 'INTERFACE_MOVE', params, onResolved })
export const moveInterfaceSucceeded = () => ({ type: 'INTERFACE_MOVE_SUCCEEDED' })
export const moveInterfaceFailed = (message: string) => ({ type: 'INTERFACE_MOVE_FAILED', message })

export const deleteInterface = (id: number, onResolved: () => void) => ({ type: 'INTERFACE_DELETE', id, onResolved })
export const deleteInterfaceSucceeded = (payload: any) => ({ type: 'INTERFACE_DELETE_SUCCEEDED', payload })
export const deleteInterfaceFailed = (message: string) => ({ type: 'INTERFACE_DELETE_FAILED', message })

export const fetchInterfaceCount = () => ({ type: 'INTERFACE_COUNT_FETCH' })
export const fetchInterfaceCountSucceeded = (count: number) => ({ type: 'INTERFACE_COUNT_FETCH_SUCCEEDED', count })
export const fetchInterfaceCountFailed = (message: string) => ({ type: 'INTERFACE_COUNT_FETCH_FAILED', message })

export const lockInterface = (id: number, onResolved?: any) => ({ type: 'INTERFACE_LOCK', id, onResolved })
export const lockInterfaceSucceeded = (itfId: any, locker: any) => ({ type: 'INTERFACE_LOCK_SUCCEEDED', payload: { itfId, locker } })
export const lockInterfaceFailed = (message: string) => ({ type: 'INTERFACE_LOCK_FAILED', message })

export const unlockInterface = (id: number, onResolved?: any) => ({ type: 'INTERFACE_UNLOCK', id, onResolved })
export const unlockInterfaceSucceeded = (itfId: any) => ({ type: 'INTERFACE_UNLOCK_SUCCEEDED', payload: { itfId } })
export const unlockInterfaceFailed = (message: string) => ({ type: 'INTERFACE_UNLOCK_FAILED', message })

export const sortInterfaceList = (ids: any, moduleId: number, onResolved: () => void) => ({ type: 'INTERFACE_LIST_SORT', ids, moduleId, onResolved })
export const sortInterfaceListSucceeded = (count: number, ids: any, moduleId: number) => ({ type: 'INTERFACE_LIST_SORT_SUCCEEDED', count, ids, moduleId })
export const sortInterfaceListFailed = (message: string) => ({ type: 'INTERFACE_LIST_SORT_FAILED', message })
export const updateCopyId = (copyId: number | string | null) => ({ type: 'UPDATE_COPY_ID', payload: copyId })

export const updateTagList = (tags: ITag[]) => ({ type: 'UPDATE_TAG_LIST', payload: tags })
