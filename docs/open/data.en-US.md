<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:32
 * @Description:
-->
# Search repository details with format data

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/data | return the repository data with request format |

### Request

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| id | true | Number | false | repository id |
| versionId | false  | Number | false | repository version id, default return the master version data |
| format | false | String | - | Now only support openapi format |

### Response

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | if success the code is 200, others is error |
| message | false    | String |    -    | the notice messages                         |
| data    | false    | Object   |    -     | return the repository data withe the request format                                |

```json
//openapi format
{
    "openapi": "3.0.3",
    "servers": [
        {
            "url": "/"
        }
    ],
    "tags": [
        {
            "name": "Example Module",
            "description": "Example Module"
        }
    ],
    "info": {
        "title": "RAP2 Pack no version test",
        "version": "1.0.0",
        "description": ""
    },
    "paths": {
        "/a": {
            "get": {
                "tags": [
                    "Example Module"
                ],
                "summary": "test",
                "description": "",
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "example",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse14497"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "ApiResponse14497": {
                "type": "object",
                "properties": {
                    "b": {
                        "type": "string",
                        "description": "",
                        "default": "2",
                        "format": "date"
                    }
                }
            }
        }
    }
}

```

## [Rap Definition](/repository/editor?id=317&itf=14138)