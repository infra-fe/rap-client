import React from 'react'
import { Button } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRapperQuery } from './utils'
const client = new QueryClient()
function App() {
  const [id, setId] = React.useState(1)
  const { data, isLoading, isFetching, refetch, ...rest } = useRapperQuery(
    'GET/user/list/header',
    { token: 'token xxx' },
    {
      onSuccess(data) {
        console.log('result:', data.data)
      },
    }
  )
  return (
    <div>
      <Button type="primary" onClick={() => refetch()}>
        refetch
      </Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
        <li>isFetching: {isFetching.toString()}</li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
export default () => {
  return (
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  )
}
