# Update repository interfaces data

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| POST   | /openAPI/repository/import | Import repository data |

### Headers

| Name        | Required | Type   | Default | Description          |
| :---------- | :------- | :----- | :------ | :------------------- |
| accessToken | true     | String |    -    | OpenAPI access token |

### Request

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| repositoryId | true | Number | - | Compatible with number and string type, the target repository id |
| mode | false | String | add | add: always create new interfaces; cover: cover the same interface; clean: clean the same interface(not supported now) |
| dataType | false | String | Swagger | RAP、Swagger、YAPI、PB (Only support swagger now) |
| async | false | Boolean | true | true: asynchronous import, import process prompt, import completion message notification; false: synchronous import |
| data | false | Object | - | The initial import data, such as swagger.json content |
| versionName | false | String | - | The repository version name, If the version name exists, this version will be updated; if the version name does not exist, a new version will be created; if not passed, the main version will be updated by default. |

### Response

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | if success the code is 200, others is error |
| message | false    | String |    -    | the notice messages                         |
| data    | false    | Null   |    -     | result data                                 |
