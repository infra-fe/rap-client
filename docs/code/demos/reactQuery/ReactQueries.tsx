/* eslint-disable multiline-comment-style */
import React from 'react'
import { Button } from 'antd'
import { useRapperQueries } from './utils'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const App: React.FC = () => {
  const [count, setCount] = React.useState(1)
  const ids = React.useMemo(() => new Array(count).fill(0).map((_, index) => index + 1), [count])

  const results = useRapperQueries({
    queries: [
      {
        url: 'GET/user/list',
        params: { name: ids[count - 1].toString() },
      } as const,
    ],
  })

  return (
    <div>
      <Button type="primary" onClick={() => setCount(x => x + 1)}>
        click
      </Button>
      {results.map((x, index) => (
        <div key={index}>
          <ul>
            <li>isLoading: {x.isLoading.toString()}</li>
            <li>isFetching: {x.isFetching.toString()}</li>
          </ul>
          <pre>{JSON.stringify(x.data, null, 2)}</pre>
        </div>
      ))}
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
