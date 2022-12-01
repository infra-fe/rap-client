import { Repository } from 'actions/types'
import { IDefaultVal } from 'components/editor/DefaultValueModal'
import { IMPORT_TYPE } from 'components/repository/ImportSwaggerRepositoryForm'
import { ENTITY_TYPE } from 'utils/consts'
import { CREDENTIALS, serve } from './constant'

// 仓库
export default {
  fetchRepositoryCount({ organization }: any) {
    return fetch(`${serve}/repository/count?organization=${organization || ''}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchRepositoryList({ user = '', organization = '', name = '', cursor = 1, limit = 100 }: any = {}) {
    return fetch(`${serve}/repository/list?user=${user}&organization=${organization}&name=${name}&cursor=${cursor}&limit=${limit}`, { ...CREDENTIALS })
      .then(res => res.json())
    // .then(json => json.data)
  },
  fetchOwnedRepositoryList({ user = '', name = '' }: any = {}) {
    return fetch(`${serve}/repository/owned?user=${user}&name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
    // .then(json => json.data)
  },
  fetchJoinedRepositoryList({ user = '', name = '' }: any = {}) {
    return fetch(`${serve}/repository/joined?user=${user}&name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
    // .then(json => json.data)
  },
  fetchRepository(id: number, token?: string, versionId?: number) {
    return fetch(
      `${serve}/repository/get?id=${id}&excludeProperty=true${
        token !== undefined ? `&token=${token}` : ''
      }${
        versionId !== undefined ? `&versionId=${versionId}` : ''
      }`,
      { ...CREDENTIALS }
    )
      .then(res => res.json())
      .then(json => json.data)
  },
  addRepository(repository: Repository) {
    return fetch(`${serve}/repository/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(repository),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateRepository(repository: Repository) {
    return fetch(`${serve}/repository/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(repository),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  importRepository(data: any) {
    return fetch(`${serve}/repository/import`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
  },
  importSwaggerRepository(data: any) {
    if (data.swagger?.data?.modules) {
      data.version = IMPORT_TYPE.RAP
      data.swagger = data.swagger.data
    }
    let importType = ''
    switch(data.version) {
      case IMPORT_TYPE.SWAGGER_2_0: importType = 'importswagger'; break
      case IMPORT_TYPE.RAP2_ITF_BACKUP: importType = 'importRAP2Backup'; break
      default: importType = 'import'
    }
    return fetch(`${serve}/repository/${importType}`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json()).catch(reason => reason)
  },
  getSwaggerRepository(data: any) {
    return fetch(`${data.docUrl}`, {
      ...CREDENTIALS,
      mode: 'cors',
      method: 'GET',
    })
      .then(res => res.json())
  },
  deleteRepository(id: number) {
    return fetch(`${serve}/repository/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchDefaultVals({ id }: { id: number }) {
    return fetch(`${serve}/repository/defaultVal/get/${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateDefaultVals({ id, data }: { id: number; data: IDefaultVal[] }) {
    return fetch(`${serve}/repository/defaultVal/update/${id}`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ list: data }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
  },
  fetchHistoryLogs({ versionId, entityId, entityType, limit, offset }:
  { versionId?: number; entityId: number; entityType: ENTITY_TYPE.INTERFACE | ENTITY_TYPE.REPOSITORY; limit: number; offset: number }) {
    return fetch(`${serve}/${entityType === ENTITY_TYPE.INTERFACE ? 'interface' : 'repository'}/history/${entityId}?limit=${limit}&offset=${offset}${versionId ? `&versionId=${versionId}` : ''}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  refreshToken(id: number) {
    return fetch(`${serve}/repository/settings/token/update?id=${id}`, { ...CREDENTIALS, method: 'POST' })
      .then(res => res.json())
      .then(json => json.data)
  },
}
