import React from 'react'
import { Button } from 'antd'
import { useRapperMutation } from './utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App: React.FC = () => {
  const { mutate, data, isLoading } = useRapperMutation('POST/user/info')
  return (
    <div>
      <Button
        type="primary"
        onClick={() =>
          mutate({
            name: 'xxxx',
          })
        }
      >
        click
      </Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
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
