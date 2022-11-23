<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:09
 * @Description:
-->
# 查询接口定义详情

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/interface/{id} | 根据接口ID，查询接口的定义详情 |

### 请求参数

### 响应参数

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | 结果编号。200表示成功 |
| message | false    | String |    -    | 成功或者失败的提示信息                         |
| data    | false    | Object   |    -     | 数据结果                                 |


```json
{
  "data": {
    "name": "search",
    "url": "/repository/list",
    "method": "GET",
    "bodyOption": "FORM_DATA",
    "description": "",
    "priority": 1643081367339,
    "status": 200,
    "moduleId": 510,
    "repositoryId": 121,
    "properties": [
      {
        "scope": "request",
        "id": 42615,
        "type": "String",
        "pos": 2,
        "name": "nameLike",
        "rule": "",
        "value": "",
        "description": "",
        "parentId": -1,
        "priority": 1,
        "required": false
      }
    ],
    "id": 2836,
    "basePath": "/api/openAPI/",
    "updatedAt": ""
  },
  "code": 1,
  "message": "",
  "name": "search name"
}
```

## [Rap定义](/repository/editor?id=317&itf=12576)