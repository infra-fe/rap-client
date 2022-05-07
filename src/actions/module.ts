export const addModule = (module: any, onResolved: () => void) => ({ type: 'MODULE_ADD', module, onResolved })
export const addModuleSucceeded = (module: any) => ({ type: 'MODULE_ADD_SUCCEEDED', module })
export const addModuleFailed = (message: string) => ({ type: 'MODULE_ADD_FAILED', message })

export const updateModule = (module: any, onResolved: () => void) => ({ type: 'MODULE_UPDATE', module, onResolved })
export const updateModuleSucceeded = (payload: any) => ({ type: 'MODULE_UPDATE_SUCCEEDED', payload })
export const updateModuleFailed = (message: string) => ({ type: 'MODULE_UPDATE_FAILED', message })

export const moveModule = (params: any, onResolved: () => void) => ({ type: 'MODULE_MOVE', params, onResolved })
export const moveModuleSucceeded = (payload: any) => ({ type: 'MODULE_MOVE_SUCCEEDED', payload })
export const moveModuleFailed = (message: string) => ({ type: 'MODULE_MOVE_FAILED', message })

export const deleteModule = (id: number, onResolved: () => void, repoId: any) => ({ type: 'MODULE_DELETE', id, onResolved, repoId })
export const deleteModuleSucceeded = (id: number) => ({ type: 'MODULE_DELETE_SUCCEEDED', id })
export const deleteModuleFailed = (message: string) => ({ type: 'MODULE_DELETE_FAILED', message })

export const sortModuleList = (ids: any, onResolved: () => void) => ({ type: 'MODULE_LIST_SORT', ids, onResolved })
export const sortModuleListSucceeded = (count: number, ids: any) => ({ type: 'MODULE_LIST_SORT_SUCCEEDED', count, ids })
export const sortModuleListFailed = (message: string) => ({ type: 'MODULE_LIST_SORT_FAILED', message })
