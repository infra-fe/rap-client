<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:14
 * @Description:
-->
# Search interface details

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/interface/{id} | According to the interface id, query the details |

### Request

### Response

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | if success the code is 200, others is error |
| message | false    | String |    -    | the notice messages                         |
| data    | false    | Object   |    -     | result data                                 |

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

## [Rap Definition](/repository/editor?id=317&itf=12576)