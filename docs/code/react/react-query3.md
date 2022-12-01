# @rapper3/react-query3

`@rapper3/react-query3` based on [react-query@3](https://react-query-v3.tanstack.com/overview)

### 1. Click `Generate TS code`

<img width="850px" src="../images/ts-generate.jpg">

### 2. Select `Rapper3.0` & `Basic Mode`

<img width="850px" src="../images/normal-mode.jpg">

### 3. Then install `react-query@3` & `@rapper3/react-query3`

```bash
yarn add @rapper3/react-query3 react-query@3
```

### Tips

> Remember to add `QueryClientProvider`. ([React Query3 Quick Start](https://react-query-v3.tanstack.com/quick-start))

```ts
import { QueryClient, QueryClientProvider } from 'react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}
```

### Usage

```ts
// utils.ts
import { http } from 'src/rapper'
import {
  createUseRapperMutation,
  createUseRapperQuery,
  createUseRapperQueries,
  createUseRapperInfiniteQuery,
  createRapperQueryOptions,
} from '@rapper3/react-query3'

export const useRapperQuery = createUseRapperQuery(http, {
  baseURL: '/app/mock/150',
})
export const useRapperQueries = createUseRapperQueries(http, {
  baseURL: '/app/mock/150',
})
export const useRapperMutation = createUseRapperMutation(http, {
  baseURL: '/app/mock/150',
})
export const useRapperInfiniteQuery = createUseRapperInfiniteQuery(http, {
  baseURL: '/app/mock/150',
})
export const op = createRapperQueryOptions(http)
```

### useRapperQuery

```ts
import React from 'react'
import { Button } from 'antd'
import { useRapperQuery } from './utils'

const UseRapperQueryApp: React.FC = () => {
  const [id, setId] = React.useState(1)
  const { data, isLoading, isFetching } = useRapperQuery(
    'GET/build/detail',
    { id: id.toString() },
    {
      onSuccess(data) {
        console.log(data.data.buildStatus)
      },
    }
  )
  return (
    <div>
      <Button onClick={() => setId((x) => x + 1)}>refresh</Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
        <li>isFetching: {isFetching.toString()}</li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### useRapperQueries

```ts
import React from 'react'
import { Button } from 'antd'
import { useRapperQueries } from './utils'

const UseRapperQueriesApp: React.FC = () => {
  const [count, setCount] = React.useState(1)
  const ids = React.useMemo(
    () => new Array(count).fill(0).map((_, index) => index + 1),
    [count]
  )

  const results = useRapperQueries({
    // queries: [['GET/build/detail', { id: ids[0].toString() }, { refetchInterval: 5000 }]],
    queries: [
      {
        url: 'GET/build/detail',
        params: { id: ids[0].toString() },
      } as const,
    ],

    // queries: ids.map((x) => ['GET/build/detail', { id: x.toString() }, { refetchInterval: 5000 }]),

    // queries: ids.map((x) =>
    //   op('GET/build/detail', { id: x.toString() }, { refetchInterval: 5000 }),
    // ),
  })

  return (
    <div>
      <Button onClick={() => setCount((x) => x + 1)}>count + 1</Button>
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
```

### useRapperMutation

```ts
import React from 'react'
import { Button } from 'antd'
import { useRapperMutation } from './utils'

const UseRapperMutationApp: React.FC = () => {
  const { mutate, data, isLoading } = useRapperMutation('POST/build/create')
  return (
    <div>
      <Button
        onClick={() =>
          mutate({
            projectName: 'test',
            moduleName: '',
            gitBranch: '',
            gitUrl: '',
            remark: '',
            cids: '',
            env: '',
            serviceId: '',
            jobType: '',
          })
        }
      >
        mutate
      </Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### useRapperInfiniteQuery

```ts
import React from 'react'
import { Button } from 'antd'
import { useRapperInfiniteQuery } from './utils'

const UseRapperInfiniteQueryApp: React.FC = () => {
  const [id, setId] = React.useState(1)
  const { data, fetchNextPage, isLoading, isFetching } = useRapperInfiniteQuery(
    'GET/build/detail',
    {
      id: id.toString(),
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
      <Button onClick={() => setId((x) => x + 1)}>refresh</Button>
      <Button onClick={() => fetchNextPage()}>Next Page</Button>
      <ul>
        <li>isLoading: {isLoading.toString()}</li>
        <li>isFetching: {isFetching.toString()}</li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```
