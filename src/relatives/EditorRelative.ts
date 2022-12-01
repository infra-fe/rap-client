// import * as OrganizationAction from '../actions/organization'
// import * as RespositoryAction from '../actions/repository'
import * as InterfaceEffects from './effects/interface'
import * as ModuleEffects from './effects/module'
import * as PropertyEffects from './effects/property'
import * as SceneEffects from './effects/scene'

export default {
  reducers: {
    copyId(state = null, action: any) {
      switch (action.type) {
        case 'UPDATE_COPY_ID':
          return action.payload
      }
      return state
    },
    tags(state = [], action: any) {
      switch (action.type) {
        case 'UPDATE_TAG_LIST':
          return action.payload
      }
      return state
    },
  },
  sagas: {
    MODULE_ADD: ModuleEffects.addModule,
    MODULE_UPDATE: ModuleEffects.updateModule,
    MODULE_MOVE: ModuleEffects.moveModule,
    MODULE_DELETE: ModuleEffects.deleteModule,

    INTERFACE_FETCH: InterfaceEffects.fetchInterface,
    INTERFACE_ADD: InterfaceEffects.addInterface,
    INTERFACE_UPDATE: InterfaceEffects.updateInterface,
    INTERFACE_MOVE: InterfaceEffects.moveInterface,
    INTERFACE_DELETE: InterfaceEffects.deleteInterface,
    INTERFACE_COUNT: InterfaceEffects.fetchInterfaceCount,
    INTERFACE_LOCK: InterfaceEffects.lockInterface,
    INTERFACE_UNLOCK: InterfaceEffects.unlockInterface,
    SCENE_ADD: SceneEffects.addScene,
    SCENE_UPDATE: SceneEffects.updateScene,
    SCENE_DELETE: SceneEffects.deleteScene,
    SCENE_LIST_FETCH: SceneEffects.fetchSceneList,
    SCENE_FETCH: SceneEffects.fetchScene,

    PROPERTY_ADD: PropertyEffects.addProperty,
    // PROPERTY_UPDATE: PropertyEffects.updateProperty,
    PROPERTIES_UPDATE: PropertyEffects.updateProperties,
    PROPERTY_DELETE: PropertyEffects.deleteProperty,

  },
  listeners: {},
}
