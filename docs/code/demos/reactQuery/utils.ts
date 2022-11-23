import { http } from '../../rapper/http'
import {
  createUseRapperMutation,
  createUseRapperQuery,
  createUseRapperQueries,
  createUseRapperInfiniteQuery,
  createRapperQueryOptions,
} from '@rapper/react-query'

export const useRapperQuery = createUseRapperQuery(http, {
})
export const useRapperQueries = createUseRapperQueries(http, {
})
export const useRapperMutation = createUseRapperMutation(http, {
})
export const useRapperInfiniteQuery = createUseRapperInfiniteQuery(http, {
})
export const op = createRapperQueryOptions(http)
