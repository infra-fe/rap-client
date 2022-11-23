<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:09:58
 * @Description:
-->
# 查询团队列表

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/organization/list | 查询团队列表 |


### 请求参数

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| nameLike | true | String | - | 对团队名进行模糊查询 |
| start | false | Number | 0 | 分页查询起始值，默认为0 |
| limit | false | Number | 25 | 分页查询的分页大小，默认为25，最大值为100 |
| orderBy | false | String | - | 默认是按照id的降序（DESC）排列，此值可以为'DESC'或者'ASC' |

### 响应参数

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | 结果编号。200表示成功 |
| message | false    | String |    -    | 成功或者失败的提示信息                         |
| data    | false    | Object   |    -     | 数据结果                                 |
| total    | false    | Number   |    -     | 总条数                                 |

``` json
{
  "code": 1,
  "message": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 121, // 团队id
        "name": "RAP-openAPI", // 团队名称
        "description": "", // 团队描述
        "ownerId": 123, // 团队所有人id
        "owner": {
          "fullname": "Bosn", //团队所有人名称
          "id": 123 // 团队所有人id
        }
      }
    ]
  }
}
```

## [Rap定义](/repository/editor?id=317&itf=12573)