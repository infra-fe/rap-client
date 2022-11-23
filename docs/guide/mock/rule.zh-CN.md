# Mock路径规则

- Mock server url拼接规则: RAP平台URL + mock + 仓库id + 方法 + 接口实际路径

- 假设rap服务器路径是: https://rap.io 就可以这样拼接地址

```
mock地址: https://rap.io/api/app/mock/154/get/example/interface

```
# 匹配顺序

1. 通过相对路径模糊搜索当前存储库和协作存储库
2. 查找所有与文档路径匹配的接口
3. 过滤所有查询参数匹配的接口
4. 当前仓库结果优先返回
5. 如果 1-4 没有找到，使用正则表达式 find if there are exits some RESTFUL(/:id or /{id}) url。
6. 如果5步有多个结果退出，会返回错误
7. 如果没有结果，也会返回错误
8. 查找是否是`scene`请求，退出则返回场景数据
9. 检查匹配接口的 `require` 参数是否为 `get` 或 `post` 方法
10. 如果响应码是301，则重定向
11. 生成mock数据并返回
12. 如果有`callback`参数，将数据包装成jsonp格式

