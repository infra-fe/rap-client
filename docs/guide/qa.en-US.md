# FAQ

### Where is the rap repo?

Github:

https://github.com/infra-fe/rap-client

https://github.com/infra-fe/rap-server

https://github.com/infra-fe/rapper

### How can I import repository？
see [import](https://infra-fe.github.io/rap-client/guide/import/rap)

### How can I import data with two-dimensional array?

If there is something wrong when you import data with two-dimensional array, you can edit the data manually.

### Why it throw an error like this when I use rapper first?

Maybe the path is relative, you need to set the prefix in the entrance of your project.

``` ts
// set global config
// when you are in develop env, you can set the prefix to your own repo, like /app/mock/3/
// when you are in live env, you can set the prefix to the real server link
const prefix = process.env.NODE_ENV === 'development' ? 'http://***/' : ''
overrideFetch({
  prefix, //interface base url
})
```

### How to set headers and query parameters in rapper?
This is only support in normal and ahooks mode in rapper now.

Scene 1 : auto send headers and query parameters

First, you need to config in the repository

Second, use the fetch or useFetch method just send as normal parameters, it will handle them automatically.

``` ts
const { data, run } = useFetch('POST/example/test', { p_query: '1', p_header: '2', p_body: 3});

fetch['POST/example/test]({ p_query: '1', p_header: '2', p_body: 3})

```

Scene 2: send more headers and query parameters temporarily, you can use the "extra" parameter

``` ts
const { data, run } = useFetch(
  'POST/example/test',
  { p_query: '1', p_header: '2', p_body: 3}, 
  {},
  {query: {p_extra_query: 'first'}, headers: {content-type: 'text/plain'}} // the extra parameter, it is optional
);

fetch['POST/example/test](
  { query: '1', header: '2', body: 3},
  {query: {p_extra_query: 'first'}, headers: {content-type: 'text/plain'}} // the extra parameter, it is optional
)
```

Scene 3: If you want to use your own method to handle special parameters that set in the platform, you can import the extra file to get them.

``` ts
enum ReqPosType {
  header = 1,
  query = 2,
  body = 3,
}

import { IReqType } from 'rapper/extra'

export const IReqType = {
  'POST/ttttt.com': { '1': 2, 'Content-Type': 1 },
  'GET/{username}/:id/ttttt.com': { Accept: 1 },
};
```
### Which Mode should I choose in rapper?

@rapper3/cli has three mode: hooks, basic, redux, you can choose depend on your own project:

Option 1：Hooks

On top of the basic mode, a encapsulation based on ahooks useRequest is provided for you to easily manage the hooks of asynchronous requests, such as loading status and data caching.

``` ts
import { useFetch } from 'src/rapper'
const { data, loading, run: refresh } = useFetch(
  'GET/api/getList',
  { id: 1 }
)
```

Option 2：Basic

Generate the TypeScript type definition of the interface and the request function in the form of each interface Promise for you, applicable to all TypeScript-based projects.

``` ts
import { fetch } from 'rapper/index'

// directly use fetch to request，you can easily get hints
fetch['GET/example/rapper']({
  // request params
  foo: 'foo'
}).then(res => {
  // return value
  const nameList = res.taskList.map(e => e.name);
})
```

Option 3：Redux

On top of the basic mode, it provides you with a Redux-based global data management package, helps you generate typed request action/reducer code, provides global interface data caching, and uses data easily through React Hooks, suitable for React+Redux project.

``` ts
import { useResponse } from 'model/rapper'

const [responseData, { id, isPending, errorMessage }] = useResponse['GET/adgroup/price/update$']()
```










