<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:18
 * @Description:
-->
# 查询仓库的模块列表和接口列表

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/{id} | 根据仓库ID，查询仓库中的模块列表和接口列表 |

### 请求参数

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| withoutModules | true | Boolean | false | 如果为【true】，返回结果不包括模块列表和接口列表。 |
| withoutInterfaces | false  | Boolean | false | 如果为【true】,返回结果不包括接口列表。 |
| versionName | false | String | - | 版本名。如果版本名存在，返回对应版本内容；如果版本名不存在或者不传，则返回主版本内容 |

### 响应参数

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | 结果编号。200表示成功 |
| message | false    | String |    -    | 成功或者失败的提示信息                         |
| data    | false    | Object   |    -     | 数据结果                                 |

```json
{
  "data": {
    "name": "RAP-openAPI",
    "id": 121,
    "description": "",
    "modules": [
      {
        "id": 511,
        "name": "Token Management",
        "description": "OpenAPI",
        "priority": 1,
        "interfaces": [
          {
            "name": "login Token",
            "id": 2841,
            "url": "/auth/token",
            "method": "POST",
            "priority": 1643082128513,
            "status": 200,
            "bodyOption": null,
            "description": "",
            "moduleId": 511,
            "repositoryId": 121
          }
        ]
      }
    ],
    "basePath": "/api/openAPI/",
    "version": {
      "id": "",
      "name": "",
      "isMaster": false
    }
  },
  "code": 1,
  "message": ""
}
```

## [Rap定义](/repository/editor?id=317&itf=12574)