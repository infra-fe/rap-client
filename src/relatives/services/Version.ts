/*
 * @Author: xia xian
 * @Date: 2022-08-10 19:03:19
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-19 10:47:01
 * @Description:
 */
import { CREDENTIALS, serve } from './constant'

export default {
  // 获取版本列表
  fetchVersionList({
    repositoryId,
    name = '',
    start = 1,
    limit = 5,
  }: { repositoryId: number; name?: string; start?: number; limit?: number }) {
    if (!repositoryId) { return Promise.resolve([]) }
    return fetch(
      `${serve}/repository/version/list?name=${name}&start=${start}&limit=${limit}&repositoryId=${repositoryId}`,
      {
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
  addVersion({
    repositoryId,
    name,
    target,
  }: { repositoryId: number; name: string; target: string}) {
    return fetch(
      `${serve}/repository/version/create`,
      {
        method: 'POST',
        body: JSON.stringify({
          repositoryId,
          name,
          target,
        }),
        headers: { 'Content-Type': 'application/json' },
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
  removeVersion({
    id,
    versionId,
  }: { versionId: number; id: number}) {
    return fetch(
      `${serve}/repository/version/delete?repositoryId=${id}&versionId=${versionId}`,
      {
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
  initVersion(id: number) {
    return fetch(`${serve}/repository/version/init?repositoryId=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
}
