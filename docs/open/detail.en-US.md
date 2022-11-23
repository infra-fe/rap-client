<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:22
 * @Description:
-->
# Search repository details

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/{id} | According to the repository id, query the module list and interface list |

### Request

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| withoutModules | true | Boolean | false | If it is [true], the returned result does not include the module list and interface list. |
| withoutInterfaces | false  | Boolean | false | If it is [true], the returned result does not include the interface list. |
| versionName | false | String | - | The repository version name, If the version name exists, this version will be updated; if the version name does not exist, a new version will be created; if not passed, the main version will be updated by default. |

### Response

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | if success the code is 200, others is error |
| message | false    | String |    -    | the notice messages                         |
| data    | false    | Object   |    -     | result data                                 |

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

## [Rap Definition](/repository/editor?id=317&itf=12574)