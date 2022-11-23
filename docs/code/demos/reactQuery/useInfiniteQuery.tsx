import React from 'react'
import { Button } from 'antd'
import { useRapperInfiniteQuery } from './utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App: React.FC = () => {
  const [id, setId] = React.useState(1)
  const { data, fetchNextPage, isLoading, isFetching } = useRapperInfiniteQuery(
    'GET/user/list',
    {
      name: id.toString(),
    },
    {
      keepPreviousData: true,
      getNextPageParam: (_lastPage, _pages) => ({
        cursor: Math.random().toString().slice(2),
      }),
    }
  )
  return (
    <div>
      <Button onClick={() => setId((x) => x + 1)}>Reset</Button>
      <Button type="primary" onClick={() => fetchNextPage()}>
        Load More
      </Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
        <li>isFetching: {isFetching.toString()}</li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

const client = new QueryClient()
export default () => {
  return (
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  )
}
