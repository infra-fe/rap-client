# 更新仓库接口信息

### API

| 方法 | 路径                           | 描述             |
| :--- | :----------------------------- | :--------------- |
| POST | /openAPI/repository/import | 导入仓库接口数据 |

### Headers

| 名称        | 必选 | 类型   | 默认值 | 描述         |
| :---------- | :--- | :----- | :----- | :----------- |
| accessToken | true | String |   -    | OpenAPI 秘钥 |

### 请求参数

| 名称 | 必选 | 类型 | 默认值 | 描述 |
| :-- | :-- | :-- | :-- | :-- |
| repositoryId | true | Number | - | RAP:RAP 导出的格式;（暂不支持）Swagger:Swagger 的导出格式;YAPI:YAPI 导出的格式;（暂不支持）PB:gRPC 的数据格式;（暂不支持）d |
| mode | false | String | add | add:增量模式;cover:覆盖模式;clean:清空模式;（暂不支持） |
| dataType | false | String | Swagger | RAP、Swagger、YAPI、PB (Only support swagger now) |
| async | false | Boolean | true | true:异步导入，导入过程提示，导入完成消息通知；false:同步导入； |
| data | false | Object | - | 兼容 JSON 字符串和 JSON 对象类型。文件内容。需要根据生成的 hash 跟已有值判断，如果内容重复则不重新导入。 |
| versionName | false | String | - | 仓库版本名, 版本名。如果版本名存在，则更新此版本；如果版本名不存在，则创建新版本；如果不传，默认更新主版本。 |

### 响应参数

| 名称    | 必选  | 类型   | 默认值 | 描述                   |
| :------ | :---- | :----- | :----- | :--------------------- |
| code    | true  | Number |    -   | 结果编号。200 表示成功 |
| message | false | String |    -   | 成功或者失败的提示信息 |
| data    | false | Null   |    -   |                        |
