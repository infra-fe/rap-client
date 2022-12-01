import { Button } from 'antd'
import { createSwr, createUseMutate } from '@rapper3/react-swr'
import { Models, http } from '../rapper/http'
import 'antd/dist/antd.min.css'

const useSwr = createSwr<Models>(http)
const useMutate = createUseMutate<Models>()
export default () => {
  const { data, isValidating, error } = useSwr('POST/user/info', { name: 'swr_name', age: 10 })
  const mutate = useMutate()
  return (
    <>
      <h3>React SWR</h3>
      <Button
        loading={isValidating}
        disabled={isValidating}
        type="primary"
        onClick={() => mutate('POST/user/info')}
      >
        Refresh
      </Button>
      {data && <pre>{JSON.stringify(data?.data || [], null, 2)}</pre>}
      {error && `Error...`}
    </>
  )
}
