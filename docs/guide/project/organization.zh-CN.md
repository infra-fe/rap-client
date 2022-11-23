## 创建团队

- 进入团队管理页面，点击 `新建团队` 按钮

<code src="./component/create_button_zh.tsx" inline=true></code>

- 在弹出的窗口中, 填入所有必填信息, 添加好团队成员, 然后点击 `提交` 按钮

<code src="./component/create_popup_zh.tsx" inline=true></code>
## 编辑团队
- 找到一个需要编辑的团队卡片，然后点击编辑按钮

<code src="./component/edit1_zh.tsx" inline=true></code>

- 或者是点击进入一个团队卡片，找到右上角`编辑团队`按钮也可以进行编辑

<code src="./component/edit2_zh.tsx" inline=true></code>
## 退出团队
- 如果你想退出一个团队，可以点击对应团队卡片上的退出按钮，确认后即可退出

<code src="./component/exit_zh.tsx" inline=true></code>
## 删除团队
- 点击团队卡片上的垃圾桶标志，会弹出删除确认框，点击确定后可以删除团队。删除团队是一个高危操作，因此会需要二次确认。

<code src="./component/delete_zh.tsx" inline=true></code>
## 团队权限

- 设置公开或者私有
1. 你可以在团队编辑页设置团队的权限
2. 如果团队设置成了公开，那么平台中的所有用户都能看到这个团队但是只能成员才可以进行编辑
3. 如果团队设置成了私有，那么只有团队成员和管理员能够访问这个团队

<code src="./component/public_zh.tsx" inline=true></code>

- 设置团队成员
1. 在团队编辑页面，可以设置团队成员，支持名称和邮箱模糊检索
<code src="./component/search_members_zh.tsx" inline=true></code>
## 创建仓库

- 在团队管理页面点击 `创建仓库` 按钮可以新增一个仓库, 参见 [创建仓库](https://infra-fe.github.io/rap-client/zh-CN/guide/project/repository#%E5%88%9B%E5%BB%BA%E4%BB%93%E5%BA%93)

## 导入仓库

- 当然，在团队管理页面，点击 `导入仓库` 按钮可以实现一个仓库的数据迁移
- 你可以粘贴url路径或者rap导出的数据, 然后点击 `提交` 按钮。 url路径的优先级要高于粘贴的数据。
- 导出数据可以参照 [仓库导出](https://infra-fe.github.io/rap-client/zh-CN/guide/export#%E4%BB%93%E5%BA%93%E5%AF%BC%E5%87%BA)

<code src="./component/import_zh.tsx" inline=true></code>

