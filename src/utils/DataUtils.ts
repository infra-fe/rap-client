import { compact, keyBy, merge, values } from 'lodash'

export function mergeObject<T>(object: T, ...sources: T[]): T {
  const sourceList = compact(sources)

  if (!sourceList?.length) {
    return object
  }

  return merge(object || {}, ...sourceList)
}

export function mergeObjectListBy<T>(object: T[], source: T[], keyName: keyof T): T[] {
  if (!object) {
    return source
  }

  if (!source) {
    return object
  }

  const objectMap = keyBy(object, keyName)
  const sourceMap = keyBy(source, keyName)

  const mergedMap = merge(objectMap, sourceMap)

  return values(mergedMap)
}
