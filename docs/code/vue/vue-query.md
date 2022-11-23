# @rapper/vue-query

`@rapper/vue-query` based on [vue-query](https://vue-query.vercel.app/#/)

## Http

### 1. Click `Generate TS code`

<img width="850px" src="../images/ts-generate.jpg">

### 2. Select `Rapper3.0` & `Basic Mode`

<img width="850px" src="../images/normal-mode.jpg">

### 3. Then install `vue-query` & `@rapper/vue-query`

```bash
yarn add @rapper/vue-query vue-query
```

## Usage

<img width="700px" src="../images/vue-query.jpg">

```ts
import { createUseQuery, createUseInfiniteQuery } from '@rapper/vue-query'
import { http, IModels } from './src/rapper'

const useQuery = createUseQuery<IModels>(http)
const useInifiniteQuery = createUseInfiniteQuery<IModels>(http)

function App() {
  const { data, isLoading, error } = useQuery('POST/advancedform/submitform')
  const { data: infiniteData } = useInifiniteQuery(
    'GET/api/advancedProfileTable'
  )
}
```
