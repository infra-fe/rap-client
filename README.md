# RAP-Client CE version (front-end static build)


### Intro

RAP is a new project based on [RAP1](https://github.com/thx/RAP) & [RAP2](https://github.com/thx/rap2-delos). It has two components:
RAP是在RAP1 & RAP2基础上重做的新项目，它包含两个组件(对应两个Github Repository)。

* rap-server: back-end data API server based on Koa + MySQL [link](https://github.com/infra-fe/rap-client)
* rap-client: front-end static build based on React [link](https://github.com/infra-fe/rap-server)

* rap-server:使用Koa + MySQL的后端API服务器 [link](https://github.com/infra-fe/rap-client)
* rap-client: React前端App [link](https://github.com/infra-fe/rap-server)

### Support 客户支持

<img src="https://user-images.githubusercontent.com/1892986/137831764-8b9f52a9-040f-4867-ad1e-a7e9c7eb9a83.jpg" alt="wechat support" width=200 />


## Deployment 部署

### development 开发模式

```sh

# initialize 初始化
npm install

# config development mode server API path in /src/config/config.dev.js
# 配置开发模式后端服务器的地址。 /src/config/config.dev.js

# test cases 测试用例
npm run test

# will watch & serve automatically 会自动监视改变后重新编译
npm run dev

```

### production

```sh
# 1. config server API path in /src/config/config.prod.js(production config file)
# 1. 配置后端服务器的地址。 /src/config/config.prod.js(生产模式配置文件)

# 2. produce react production package
# 2. 编译React生产包
npm run build

# 3. use serve or nginx to serve the static build directory
# 3. 用serve命令或nginx服务器路由到编译产出的build文件夹作为静态服务器即可

serve -s ./build -p 80
```

## Author

* Owner: Shopee Infra FE Team
* Contributers: [link](https://github.com/infra-fe/rap-client/graphs/contributors)



### Tech Arch

* Front-end (rap-client)
    * React / Redux / Saga / Router
    * Mock.js
    * SASS / Bootstrap 4 beta
    * server: nginx
* Back-end (rap-server)
    * Koa
    * Sequelize
    * MySQL
    * Server
    * server: node
