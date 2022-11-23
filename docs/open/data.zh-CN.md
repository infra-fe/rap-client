<!--
 * @Author: xia xian
 * @Date: 2022-06-06 17:26:30
 * @LastEditors: xia xian
 * @LastEditTime: 2022-11-23 17:10:27
 * @Description:
-->
# 查询指定格式的仓库数据

### API

| Method | Endpoint                       | Description            |
| :----- | :----------------------------- | :--------------------- |
| GET   | /openAPI/repository/data | 查询指定格式的仓库数据 |

### 请求参数

| Name | Required | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| id | true | Number | false | 仓库id |
| versionId | false  | Number | false | 版本id，默认返回主版本数据 |
| format | false | String | - | 目前只支持openapi格式 |

### 响应参数

| Name    | Required | Type   | Default | Description                                 |
| :------ | :------- | :----- | :------ | :------------------------------------------ |
| code    | true     | Number |    -    | 结果编号。200表示成功 |
| message | false    | String |    -    | 成功或者失败的提示信息                         |
| data    | false    | Object   |    -     | 指定格式的数据结果                                 |

```json
//openapi返回格式
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

## [Rap定义](/repository/editor?id=317&itf=14138)