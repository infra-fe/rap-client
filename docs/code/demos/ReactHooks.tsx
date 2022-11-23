import { Button } from 'antd'
import { useHttp } from '../rapper/react'
import 'antd/dist/antd.min.css'
export default () => {
  const { data, loading, runAsync } = useHttp('POST/user/info/header', {
    token: 'token',
    name: 'name222',
    age: 10,
    __scene: 'test111',
  })
  console.log(3333, data)
  return (
    <div>
      <Button loading={loading} onClick={() => runAsync({ name: '333' })}>
        fetch
      </Button>
      <pre>response: {JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
