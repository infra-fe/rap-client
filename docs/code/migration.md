# Rapper2.x -> Rapper3.0

## Override fetch

> Before: v2

```ts
import { createFetch, defaultFetch } from 'rapper/index'
import axios from 'axios'

createFetch(async ({ url, method, params, extra }) => {
  try {
    const response = await axios({
      method,
      url,
      data: params,
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
})
```

> After: v3

In Rapper@v3, we have axios built in，so you can use `interceptor` directly

```ts
import { http } from 'src/rapper'

function overrideRapper() {
  // axios's interceptor
  http.interceptor.request.use((config) => config)
}

overrideRapper()

http('GET/api/list')
```

## Config baseURL

> Before: v2

```ts
import { overrideFetch } from './rapper/index'

overrideFetch({
  prefix: '/api/app/mock/{projectId}',
})
```

> After: v3
>
> We have default baseURL built in:

```ts
export const http = createHttpRequest<IModels>({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? ''
      : '/api/app/mock/{projectId}',
})
```

If you want to custom by yourself，you can use interceptor(base on axios)

```ts
import { http } from 'src/rapper'
// config: AxiosRequestConfig
http.interceptor.request.use((config) => {
  config.baseURL = 'your baseURL'
  return config
})
```

### Other configuration

If you want to do more configuration，plz follow [interceptor in axios](https://github.com/axios/axios#interceptors)

```ts
import { http } from 'src/rapper'

// axios's interceptor
http.interceptor.request.use((config) => {
  config.header = {
    ...config.header,
    Authorization: 'Bearer your token',
  }
  return config
})

http('GET/api/list')
```
