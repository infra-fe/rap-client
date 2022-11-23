# FAQ

### RAP的仓库地址是?

Github:

https://github.com/infra-fe/rap-client

https://github.com/infra-fe/rap-server

https://github.com/infra-fe/rapper

### 如何导入数据到RAP中？
参照 [数据导入](https://infra-fe.github.io/rap-client/zh-CN/guide/import/rap)

### 如何导入二维数组?

导入二维数组的时候如果数据有问题，可以手动改动编辑接口

### 首次运行rapper的时候为什么会请求不到数据?

原因可能是因为平台配置的接口是相对路径，需要用overrideFetch设置路径前缀

``` ts
// 全局配置
// 如果是开发模式下，需要设置mock服务器的地址, 例如 /app/mock/3/
// 如果是线上环境，需要设置真实的服务器地址, 例如 /api/
const prefix = process.env.NODE_ENV === 'development' ? 'http://***/' : ''
overrideFetch({
  prefix, //接口前缀
})
```

### 如何用rapper发送headers和在post接口中发送query参数?
在rapper的 hooks 和 普通 模式可以支持发送

场景 1 : 自动发送headers和query参数

首先, 你需要在平台上正确的配置参数类型

其次，在用fetch或者useFetch方法的时候将这些参数当成常规参数使用，底层会自动处理这些参数

``` ts
const { data, run } = useFetch('POST/example/test', { p_query: '1', p_header: '2', p_body: 3});

fetch['POST/example/test]({ p_query: '1', p_header: '2', p_body: 3})

```

场景 2: 需要临时发送额外的headers和query参数, 可以在 "extra" 参数中去发送它们

``` ts
const { data, run } = useFetch(
  'POST/example/test',
  { p_query: '1', p_header: '2', p_body: 3}, 
  {},
  {query: {p_extra_query: 'first'}, headers: {content-type: 'text/plain'}} // extra参数，可选
);

fetch['POST/example/test](
  { query: '1', header: '2', body: 3},
  {query: {p_extra_query: 'first'}, headers: {content-type: 'text/plain'}} // extra参数，可选
)
```

场景 3: 如果你想要找到这些配置在平台特殊的参数，并且需要自己处理它们，你可以导入extra文件

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
### 我应该选择rapper的哪种模式?

@Infra/rapper分为三种模式：hoosk模式，基础模式 和Redux模式，供你根据项目的特点自行选择：

模式 1：Hooks

在基础模式之上为你提供了基于 ahooks useRequest的封装，让你轻松管理异步请求的hooks，比如loading状态、数据缓存

``` ts
import { useFetch } from 'src/rapper'
const { data, loading, run: refresh } = useFetch(
  'GET/api/getList',
  { id: 1 }
)
```

模式 2：基础模式

为你生成接口的 TypeScript 类型定义和每个接口 Promise 形式的请求函数，适用于所有基于 TypeScript 的项目

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

模式 3：Redux

在基础模式之上为你提供了基于 Redux 的全局数据管理封装，帮你生成了类型化的请求 action/reducer 代码，提供全局接口数据缓存，通过 React Hooks 轻松使用数据，适用于使用 React+Redux 的项目

``` ts
import { useResponse } from 'model/rapper'

const [responseData, { id, isPending, errorMessage }] = useResponse['GET/adgroup/price/update$']()
```










