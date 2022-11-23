import { Button } from 'antd'
import React, { useState } from 'react'
import { http } from '../rapper/http'
import 'antd/dist/antd.min.css'
export default () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  async function handleClick() {
    setLoading(true)
    try {
      const res = await http('POST/user/info/header', {
        token: 'xx',
        name: 'name_11',
        age: 10,
      })
      setData(res)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Button type="primary" loading={loading} onClick={handleClick}>
        fetch
      </Button>
      <pre>response: {JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
