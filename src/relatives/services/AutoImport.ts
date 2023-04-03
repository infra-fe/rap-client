
import { CREDENTIALS, serve } from './constant'

export enum IMPORT_SOURCE {
  YAPI = 'YAPI',
  SWAGGER = 'SWAGGER'
}

export enum FREQUENCY_TYPE {
  ThreeHours = 'ThreeHours',
  HalfDay = 'HalfDay',
  OneDay = 'OneDay'
}

export interface IAutoImportModel {
  id?: number
  repositoryId: number
  taskName: string
  importSource: IMPORT_SOURCE
  frequency: FREQUENCY_TYPE
  importHost?: string
  importProjectId?: string
  importToken?: string
  versionId?: number

}

export function getAutoImportList(
  {repositoryId, offset, limit, versionId}:
  {repositoryId: number; offset: number; limit: number; versionId: number}) {
  return fetch(`${serve}/autoImport/list?repositoryId=${repositoryId}&offset=${offset}&limit=${limit}${versionId === undefined ? '' : `&versionId=${versionId}`}`, { ...CREDENTIALS } ).then(res => res.json())
}

export function createAutoImport(data: IAutoImportModel) {
  return fetch(
    `${serve}/autoImport/create`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function updateAutoImport(data: IAutoImportModel) {
  return fetch(
    `${serve}/autoImport/update`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function deleteAutoImport(id: number, repositoryId: number) {
  return fetch(
    `${serve}/autoImport/delete`,
    {
      method: 'POST',
      body: JSON.stringify({id, repositoryId}),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function openAutoImportTask(id: number, repositoryId: number) {
  return fetch(
    `${serve}/autoImport/openTask`,
    {
      method: 'POST',
      body: JSON.stringify({id, repositoryId}),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function closeAutoImportTask(id: number, repositoryId: number) {
  return fetch(
    `${serve}/autoImport/closeTask`,
    {
      method: 'POST',
      body: JSON.stringify({id, repositoryId}),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function verifyImportTask(data: IAutoImportModel) {
  return fetch(
    `${serve}/autoImport/verify`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

export function getImportHistory({importId, offset, limit}: {importId: number; offset: number; limit: number}) {
  return fetch(`${serve}/autoImport/history?importId=${importId}&offset=${offset}&limit=${limit}`, { ...CREDENTIALS } ).then(res => res.json())
}

export function executeAutoImport(id: number, repositoryId: number) {
  return fetch(
    `${serve}/autoImport/execute`,
    {
      method: 'POST',
      body: JSON.stringify({id, repositoryId}),
      headers: { 'Content-Type': 'application/json' },
      ...CREDENTIALS,
    }
  ).then(res => res.json())
}

