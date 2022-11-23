<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:04
 * @Description:
-->
# Search organization lists

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/organization/list | Search organization lists |


### Request

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| nameLike | true | String | - | Fuzzy query for organization name |
| start | false | Number | 0 | The starting value of paging query, the default is 0 |
| limit | false | Number | 25 | Pagination size for pagination query, default is 25, maximum is 100 |
| orderBy | false | String | - | The default is to sort in descending order of id (DESC), this value can be 'DESC' or 'ASC' |

### Response

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | if success the code is 200, others is error |
| message | false    | String |    -    | the notice messages                         |
| data    | false    | Object   |    -     | result data                                 |
| total    | false    | Number   |    -     | total count                                 |

``` json
{
  "code": 1,
  "message": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 121, // organization id
        "name": "RAP-openAPI", // organization name
        "description": "", // organization description
        "ownerId": 123, // organization owner id
        "owner": {
          "fullname": "Bosn", //organization owner fullname
          "id": 123 // organization owner id
        }
      }
    ]
  }
}
```

## [Rap Definition](/repository/editor?id=317&itf=12573)