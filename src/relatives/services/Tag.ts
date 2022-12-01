/*
 * @Author: xia xian
 * @Date: 2022-08-24 10:59:51
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-24 15:51:28
 * @Description:
 */
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
  fetchTagList({
    repositoryId,
    start = 0,
    limit = 5,
  }: { repositoryId: number; start?: number; limit?: number }) {
    if (!repositoryId) { return [] }
    return fetch(
      `${serve}/tag/list?start=${start}&limit=${limit}&repositoryId=${repositoryId}`,
      {
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
  createTag({
    repositoryId,
    name,
    level = 'repository',
  }: { repositoryId: number; name: string; level: string}) {
    return fetch(
      `${serve}/tag/create`,
      {
        method: 'POST',
        body: JSON.stringify({
          repositoryId,
          name,
          level,
        }),
        headers: { 'Content-Type': 'application/json' },
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
  removeTag({
    id,
    tagId,
  }: { tagId: number; id: number}) {
    return fetch(
      `${serve}/tag/remove?repositoryId=${id}&tagId=${tagId}`,
      {
        ...CREDENTIALS,
      }
    ).then(res => res.json())
  },
}
