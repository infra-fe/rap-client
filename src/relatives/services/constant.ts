import config from 'config'
export const serve = config.serve
export const CREDENTIALS: any = { credentials: 'include' }
export const HEADERS = {
  JSON: { 'Content-Type': 'application/json' },
}
