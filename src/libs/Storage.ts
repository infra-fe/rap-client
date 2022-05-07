import localforage from 'localforage'

// global.localforage = localforage

/**
 * 常用有效期枚举值
 */
const forever = -1 // 永久有效
const oneSecond = 1000 // 一秒钟
const oneMinute = 60 * oneSecond // 一分钟
const oneHour = 60 * oneMinute // 一小时
const oneDay = 24 * oneHour  // 一天
const oneMonth = 30 * oneDay // 一月
const oneYear = 365 * oneDay // 一年

export const ExpireTimeEnum = {
  forever,
  oneSecond,
  oneMinute,
  oneHour,
  oneDay,
  oneMonth,
  oneYear,
}
export const DefaultExpireTime = oneDay

/**
 * 带有效期的localStorage
 */
export class Storage {

  /**
   * 私有属性，存储的命名空间，用于区分不同项目或者模块
   */
  private _namespace: string = '$NS' // 设置一个默认的命名空间
  private _tableName: string = 'DefaultTable' // 存储表名
  private _storage = null

  constructor(namespace?: string, tableName?: string) {
    this.setNamespce(namespace, tableName)
    this.clean(true)
  }

  /**
   * 重新设置命名空间，建议一个项目里只设置一次
   * @param namespace 新命名空间
   * @param tableName 新表名字
   * @param withClean 是否清除新命名空间的过期数据
   */
  private setNamespce(namespace?: string, tableName?: string, withClean?: boolean) {
    if (namespace) {
      this._namespace = namespace
    }
    if (tableName) {
      this._tableName = tableName
    }

    // localforage.config({ name: this._namespace, storeName: this._tableName })
    this._storage = localforage.createInstance({ name: this._namespace, storeName: this._tableName })

    if (withClean) {
      this.clean(true)
    }
  }

  /**
   * 获取当前的命名空间
   * @returns
   */
  public getNamespace() {
    return this._namespace
  }

  /**
   * 存储值，可指定有效期
   * @param key 业务key
   * @param value 业务值
   * @param expireTime 有效时长
   * @returns
   */
  public async set(key: string, value: any, expireTime?: number) {
    const storeKey = this.createStoreKey(key)

    try {
      const expire = expireTime === forever ? forever : Date.now() + (expireTime || DefaultExpireTime)

      const storeValue = {
        value,
        id: Date.now(),
        expire,
      }

      await this._storage.setItem(storeKey, storeValue)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('data save error:', e)
      return
    }
  }

  /**
   * 获取值
   * @param key 业务key
   * @returns
   */
  public async get(key: string): Promise<any> {
    const storeKey = this.createStoreKey(key)
    const storeValue = await this._storage.getItem(storeKey)

    const { isExpired, value } = this.checkValue(storeValue)
    if (!isExpired) {
      // 数据未过期
      return value
    } else {
      // 数据已过期
      this._storage.removeItem(storeKey)
      return
    }
  }

  /**
   * 移除某一个值
   * @param key 业务key
   */
  public async remove(key?: string) {
    const storeKey = this.createStoreKey(key)
    await this._storage.removeItem(storeKey)
  }

  /**
   * 根据业务key模糊删除
   * @param keyLike 业务key的前项匹配字符串
   */
  public removeLike(keyLike?: string) {
    this.clean(false, keyLike)
  }

  /**
   * 移除命名空间下的所有值，如果命名空间没有指定，调用无效
   */
  public removeAll() {
    if (!this._namespace) {
      // 如果为指定命名空间，不能批量删除
      return
    }

    this.clean()
  }

  /**
   * 私有方法，生成存储用的key
   * @param key 业务key
   * @returns
   */
  private createStoreKey(key: string) {
    const driver = this._storage?.driver()
    if ([localforage.INDEXEDDB, localforage.WEBSQL].includes(driver)) {
      return key
    } else {
      return `${this._namespace}_${this._tableName}_${key}`
    }
  }

  /**
   * 检测数据是否已过期
   * @param storeValue
   * @returns
   */
  private checkValue(storeValue: any) {
    let storeObject = null
    if (storeValue && typeof storeValue === 'string') {
      try {
        storeObject = JSON.parse(storeValue)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('data get error:', e)
        return
      }
    } else {
      storeObject = storeValue
    }

    if (!storeObject) {
      return { isExpired: true }
    }

    const { value, expire } = storeObject
    return {
      isExpired: expire !== forever && Date.now() > expire, // 当前时间大于过期时间点
      value,
    }
  }

  /**
   * 清除本命名空间下过期的数据存储
   * @param onlyExpired
   * @param keyLike
   */
  private clean(onlyExpired?: boolean, keyLike?: string) {
    const preMatch = keyLike ? `${this._namespace}_${keyLike}` : `${this._namespace}_`
    let canRemove = !onlyExpired

    const storeKeys = Object.keys(this._storage)
    for (const storeKey of storeKeys) {
      if (storeKey.indexOf(preMatch) === 0) {
        if (onlyExpired) {
          const storeValue = this._storage.getItem(storeKey)
          canRemove = this.checkValue(storeValue).isExpired
        }
        if (canRemove) {
          this._storage.removeItem(storeKey)
        }
      }
    }
  }
}
