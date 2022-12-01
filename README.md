# RAP-Client CE version (front-end static build)

### Documents 文档站点

[RAP User Manual](https://infra-fe.github.io/rap-client/)

[RAP使用手册、帮助文档站点](https://infra-fe.github.io/rap-client/)
### Introduction 简介

RAP is a new project based on [RAP1](https://github.com/thx/RAP) & [RAP2](https://github.com/thx/rap2-delos). It has two components:
RAP是在RAP1 & RAP2基础上重做的新项目，它包含三个组件(对应三个Github Repository)。

* rap-server: 使用Koa + MySQL的后端API服务器 back-end data API server based on Koa + MySQL [link](https://github.com/infra-fe/rap-server)
* rap-client: React前端App front-end static build based on React [link](https://github.com/infra-fe/rap-client)
* rapper3: 自动代码生成工具 generate code tools based on RAP [link](https://github.com/infra-fe/rapper3)

### Rapper 3

Rapper3 has been refactored on the basis of Rapper, providing more code generation modes and more flexible configuration methods, welcome to experience.
[Document link](https://infra-fe.github.io/rap-client/code), [NPM list](https://www.npmjs.com/search?q=%40rapper3)

Rapper3在Rapper基础上进行了重构，提供更多的代码生成模式，更灵活的配置方式，欢迎体验
[文档链接](https://infra-fe.github.io/rap-client/code), [NPM列表](https://www.npmjs.com/search?q=%40rapper3)

### Support 客户支持

<img src="https://user-images.githubusercontent.com/13103261/205011922-fb031bd9-2651-4844-bd3b-1cc414c11ac6.png" alt="wechat support" width=200 />


## Deployment 部署

### development 开发模式

```sh

# initialize 初始化
yarn install

# config development mode server API path in /src/config/config.dev.js
# 配置开发模式后端服务器的地址。 /src/config/config.dev.js

# test cases 测试用例
yarn test

# will watch & serve automatically 会自动监视改变后重新编译
yarn dev

```

### production

```sh
# 1. config server API path in /src/config/config.prod.js(production config file)
# 1. 配置后端服务器的地址。 /src/config/config.prod.js(生产模式配置文件)

# 2. produce react production package
# 2. 编译React生产包
yarn build

# 3. use serve or nginx to serve the static build directory
# 3. 用serve命令或nginx服务器路由到编译产出的build文件夹作为静态服务器即可

serve -s ./build -p 80
```

## Author 作者

* Owner: Shopee Infra FE Team
* Contributers: [link](https://github.com/infra-fe/rap-client/graphs/contributors)

* Owner: Shopee FE Team
* Author:
  * Before v2.3: all by [@Nuysoft](https://github.com/nuysoft/), creator of [mockjs](mockjs.com).
  * v2.4+ / CE version: [Bosn](http://github.com/bosn/)(creator of [RAP1](https://github.com/thx/RAP)) [Nuysoft](https://github.com/nuysoft/)
  * We are looking for more and more contributors :)


### Tech Arch 技术栈

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
