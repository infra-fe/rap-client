# 接口管理
## 新建接口
- 在编辑页左侧点击 `新建接口` 按钮

<code src="./component/create_inf_zh.tsx" inline=true></code>

- 输入接口基本信息, 点击 `提交`

<code src="./component/popup_inf_zh.tsx" inline=true></code>
## 编辑接口
- 创建完接口以后，你可以在左侧接口列表中找到该接口，并且可以通过右侧的搜索框搜索接口

<code src="./component/list_zh.tsx" inline=true></code>

- 点击 `编辑` 按钮, 就可以编辑接口基本信息，请求参数以及响应参数，编辑完成以后点击`提交`按钮

<code src="./component/edit_inf_zh.tsx" inline=true></code>

- 一旦进入编辑状态，这个接口将会被锁定，这样其他用户就无法同时修改这个接口，如果在编辑状态切换到其他接口，会提示释放该接口

<code src="./component/lock_zh.tsx" inline=true></code>

### 请求参数
- 请求参数有三种类型('header'、'query params'、'body params'), 可以根据实际接口需要来设置
<code src="./component/request_zh.tsx" inline=true></code>
- 一般来说，不要在 `get` and `delete` 方法中包含body类型的参数, 如果这么设置以后平台会给出提示
<code src="./component/warning_zh.tsx" inline=true></code>
- 点击 `+` 或者 `新建`, 可以新增一行参数, 填写参数 `名称`,`必选` 等其他字段
<code src="./component/add_zh.tsx" inline=true></code>
- 如果选择的是 `object` 或者 `array` 类型, 点击该参数前面的 `+` 按钮, 可以给该字段添加子字段
<code src="./component/add_children_zh.tsx" inline=true></code>
### 响应内容
- 编辑响应内容的操作与请求参数一致
### 数据导入
- 通过`导入`按钮可以便捷地导入JSON5格式的数据, 在导入面板中填入数据以后点击 `提交` 按钮
<code src="./component/import_button_zh.tsx" inline=true></code>
<code src="./component/import_zh.tsx" inline=true></code>
- 点击 `格式化` 按钮，可以对数据进行格式化
### 数据预览
- 可以再 `生成规则` 和 `初始值` 一栏中填写数据对应的mock规则, 点击 `预览` 按钮可以看到生成的mock语法以及mock数据. 例如，希望随机生成1-10个星星字符, 就可以像下面的图示那样填写规则.想要了解更多的mock规则，参见 [mock规则](https://infra-fe.github.io/rap-client/zh-CN/guide/mock/rule)
<code src="./component/preview_zh.tsx" inline=true></code>
- 编辑好接口信息以后，点击mock链接就可以看到mock服务器返回的mock数据了
<code src="./component/mock.tsx" inline=true></code>
### 排序
- 拖动编辑的行即可改变参数的位置
<code src="./component/param_order.tsx" inline=true></code>
### 快捷键
- 我们提供了一些快捷键以便有更好的编辑体验

|  按键      | 功能                                |
| --------- | -------------------------------------- |
| ctrl + c  | 复制所在行数据       |
| ctrl + v  | 所在行的下一行粘贴刚才复制的数据 |
| ctrl + s  | 保存接口                              |
| ctrl + e  | 编辑接口                          |
| ctrl + d  | 删除数据                       |

## 接口排序
- 拖动接口即可改变接口的排列殊勋
<code src="./component/order.tsx" inline=true></code>
## 接口迁移
- 如果想要移动或者复制一个接口到其他的模块或者其他的参股，点击 `复制/移动`按钮， 选择好目标仓库和目标模块以后，点击`提交`按钮

<code src="./component/move_zh.tsx" inline=true></code>
## 删除接口
- 鼠标Hover到列表的接口之上，点击垃圾桶图标按钮，就可以删除该接口，删除操作需要进行二次确认

<code src="./component/delete_inf_zh.tsx" inline=true></code>
## 模板

- 如果一个接口的请求和响应参数非常的常用，不想要总是去定义同样的内容，可以把该接口设置为一个模板

<code src="./component/template_zh.tsx" inline=true></code>

- 如果设置的有模板的话，在新建接口的时候就可以选择对应的模板，那么新接口将会包含模板信息

<code src="./component/create_from_tempalte_zh.tsx" inline=true></code>

## 历史

- 所有的关键操作都会记录在接口历史中，参见 [接口历史](https://infra-fe.github.io/rap-client/zh-CN/guide/interface/history#%E6%8E%A5%E5%8F%A3%E5%8E%86%E5%8F%B2)