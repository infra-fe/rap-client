import { Storage } from '../libs/Storage'

export { ExpireTimeEnum } from '../libs/Storage'

/**
 * 默认导出一个单例，并指定命名空间。
 * 如果需要新的命名空间实例，可以自行实例化Storage`new Storage('xxx')`
 */
export const DefaultStorage = new Storage('rap')

// 全局导出，不同组件里会共用
export const BaseServerStorage = new Storage('rap', 'BaseServerSetting')
export const GlobalHeadersStorage = new Storage('rap', 'GlobalHeadersSetting')
export const TargetResponseStorage = new Storage('rap', 'TargetResponse')
export const RequestParamsStorage = new Storage('rap', 'RequestParams')
