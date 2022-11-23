<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:09:53
 * @Description:
-->
# Search repository lists

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/list | Search repository lists |


### Request

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| nameLike | true | String | - | Fuzzy query for repository name |
| owners | false | String | - | Query all repository lists in the user list. Multiple values are separated by commas.(not supported now) |
| start | false | Number | 0 | The starting value of paging query, the default is 0 |
| limit | false | Number | 25 | Pagination size for pagination query, default is 25, maximum is 100 |
| organizations | String | String | - | Query all warehouse lists in the organization list. Multiple values are separated by commas.(not supported now) |
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
  "data": {
    "total": 0,
    "list": [
      {
        "name": "RAP-openAPI", // repository name
        "description": "", // repository description
        "id": 121, // repository id
        "updatedAt": "2022-07-18T10:47:59.000Z" // repository updated time
      }
    ]
  },
  "code": 1,
  "message": ""
}
```

## [Rap Definition](/repository/editor?id=317&itf=12575)