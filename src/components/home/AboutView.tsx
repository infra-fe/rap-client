import Markdown from 'markdown-to-jsx'
import { Paper } from '@mui/material'


function AboutView() {
  const md = `
## RAP is a new project based on [RAP1](https://github.com/thx/RAP) & [RAP2](https://github.com/thx/rap2-delos). It has two components:
  * rap-server: back-end data API server based on Koa + MySQL [link](https://github.com/infra-fe/rap-client)
  * rap-client: front-end static build based on React [link](https://github.com/infra-fe/rap-server)

## RAP是在RAP1 & RAP2基础上重做的新项目，它包含两个组件(对应两个Github Repository)。
  * rap-server:使用Koa + MySQL的后端API服务器 [link](https://github.com/infra-fe/rap-client)
  * rap-client: React前端App [link](https://github.com/infra-fe/rap-server)


  `
  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Markdown>{md}</Markdown>
    </Paper>
  )
}

export default AboutView
