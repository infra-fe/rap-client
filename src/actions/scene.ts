import { IScene } from 'components/scene/SceneConfigModal'

export const addScene = (scene: Partial<IScene>, onResolved: (e: any) => void) => ({ type: 'SCENE_ADD', scene, onResolved })
export const addSceneSucceeded = (payload: any) => ({ type: 'SCENE_ADD_SUCCEEDED', payload })
export const addSceneFailed = (message: string) => ({ type: 'SCENE_ADD_FAILED', message })

export const updateScene = (scene: Partial<IScene>, onResolved: (res: any) => void) => ({ type: 'SCENE_UPDATE', scene, onResolved })
export const updateSceneSucceeded = (payload: any) => ({ type: 'SCENE_UPDATE_SUCCEEDED', payload })
export const updateSceneFailed = (message: string) => ({ type: 'SCENE_UPDATE_FAILED', message })

export const deleteScene = (id: number, onResolved: () => void) => ({ type: 'SCENE_DELETE', id, onResolved })
export const deleteSceneSucceeded = (payload: any) => ({ type: 'SCENE_DELETE_SUCCEEDED', payload })
export const deleteSceneFailed = (message: string) => ({ type: 'SCENE_DELETE_FAILED', message })

export const fetchSceneList = (interfaceId: number, onResolved: (sceneList: IScene[]) => void) => ({ type: 'SCENE_LIST_FETCH', interfaceId, onResolved })

export const fetchSceneListSucceeded = (payload: any) => ({ type: 'SCENE_LIST_FETCH_SUCCEEDED', payload })
export const fetchSceneListFailed = (message: string) => ({ type: 'SCENE_LIST_FETCH_FAILED', message })

export const fetchScene = (id: number, onResolved: (scene: IScene) => void) => ({ type: 'SCENE_FETCH', id, onResolved })

export const fetchSceneSucceeded = (payload: any) => ({ type: 'SCENE_FETCH_SUCCEEDED', payload })
export const fetchSceneFailed = (message: string) => ({ type: 'SCENE_FETCH_FAILED', message })
