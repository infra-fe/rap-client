## 基本操作
- 根据接口文档定义，可以自动生成多种语言的代码 (目前只支持 TypeScript).
- 进入接口编辑界面, 点击 `生成ts代码`
<code src="./component/button_code_zh.tsx" inline=true></code>
## 选择模式
<code src="./component/mode_zh.tsx" inline=true></code>
## 项目设置
- 打开业务仓库代码, 根据页面上的步骤操作.
- 在执行 `yarn rapper` 命令以后, 就能够根据平台配置自动生成代码了

<code src="./component/steps_zh.tsx" inline=true></code>
## Override
- 一般来说，平台配置的接口路径都会是相对路径, 所以需要用 `override` 方法来设置基础路径。例如, 在开发模式下, 可以配置为mock server的路径, 在生产环境，可以配置为实际的服务器路径

``` ts
import { overrideFetch } from 'src/rapper';

const baseURL = process.env.NODE_ENV === 'development' ? '/app/mock/142/post/' : '/'

overrideFetch({
  prefix: basePath
})

```

- Override 支持传递函数，比如一些需要处理token的场景.

``` ts
import axios, { AxiosError } from 'axios'
import { FetchConfigFunc, IUserFetchParams } from '@rapper3/cli/runtime/commonLib'
import { overrideFetch } from '../rapper'

const baseURL = process.env.NODE_ENV === 'development' ? '/app/mock/142/post/' : '/'


export function overrideRapper() {
  const axiosInstance = axios.create({
    baseURL
  })

  axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response && error.response.status !== 200) {
      return error.response
    }
    throw error
  })
  const overFunc = async (config: IUserFetchParams) => {
    const { url, method, params } = config
    try {
      const response = await axiosInstance({
        method,
        url,
        ...(method === 'GET' ? { params } : { data: params })
      })
      const res = response.data
      if (res.errno === 0) return response.data
      throw res
    } catch (error) {
      throw error?.response?.data || error
    }
  }
  overrideFetch(overFunc as FetchConfigFunc)
}

```
