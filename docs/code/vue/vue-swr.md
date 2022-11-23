# @rapper/vue-swr

`@rapper/vue-swr` based on [swrv](https://docs-swrv.netlify.app/)

### 1. Click `Generate TS code`

<img width="850px" src="../images/ts-generate.jpg">

### 2. Select `Rapper3.0` & `Basic Mode`

<img width="850px" src="../images/normal-mode.jpg">

### 3. Then install `swrv` & `@rapper/vue-swr`

```bash
yarn add @rapper/vue-swr swrv
```

## Usage

<img width="700px" src="./../images/vue-swr.jpg">

```ts
import { createSwrv } from '@rapper/vue-swr'
import { http, IModels } from './src/rapper'

const useSwr = createSwrv<IModels>(http)

function App() {
  const { data, isValidating, mutate, error } = useSwr(
    'POST/advancedform/submitform'
  )
}
```
