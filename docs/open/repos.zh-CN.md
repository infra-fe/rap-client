<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:09:44
 * @Description:
-->
# 查询仓库列表

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/list | 查询仓库列表 |


### 请求参数

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| nameLike | true | String | - | 对仓库名进行模糊查询 |
| owners | false | String | - | 【暂不实现】查询用户列表所有的仓库列表，多个值用英文逗号分隔。 |
| start | false | Number | 0 | 分页查询起始值，默认为0 |
| limit | false | Number | 25 | 分页查询的分页大小，默认为25，最大值为100 |
| organizations | String | String | - | 【暂不实现】查询组织列表所有的仓库列表，多个值用英文逗号分隔。 |
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
  "data": {
    "total": 0,
    "list": [
      {
        "name": "RAP-openAPI", // 仓库名称
        "description": "", // 仓库描述
        "id": 121, // 仓库id
        "updatedAt": "2022-07-18T10:47:59.000Z" // repository更新时间
      }
    ]
  },
  "code": 1,
  "message": ""
}
```

## [Rap定义](/repository/editor?id=317&itf=12575)