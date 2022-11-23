# 初识RAP

# RAP
在开始使用 RAP 之前，我们先来熟悉一下 RAP 的网站结构，这将让你快速了解RAP。

### 登录
首先，Google登录RAP。

<code src="./component/login_zh.tsx" inline=true></code>
### 首页
登录后进入首页

1 在页面的左上方是导航栏, 你将会看到 `仓库`, `团队` 的导航链接

2 在页面的右上方, 是 `语言` 切换按钮, 已经用户信息管理入口

3 在页面中间的右半部分，你能快捷地看到已经加入的所有仓库

4 在页面中间的左半部分，你能够看到近期仓库的改动历史

<code src="./component/home_zh.tsx" inline=true></code>

### 仓库
点击导航上的仓库按钮，进入仓库列表页面。 如果您是新用户，您可以看到`新建仓库`按钮来创建一个新的仓库。 您下次将在此页面上看到所有仓库列表。 单击一个仓库，您将进入编辑页面。

1 在页面的上方，这里是功能区，你可以看到诸如 `导入`,`导出`,`生成ts代码等`等多个操作按钮

2 在页面上方的右边，是搜索区，你可以通过名称或者接口id来检索

3 中间部分, 是模块标签，用来将多个接口分类聚合成不同的逻辑模块

4 当你选中了一个模块，在页面的左边可以查看到这个模块下的所有的接口， 你可以编辑和删除管理这些接口

5 在页面的右半部分，展示的是接口的基本信息、请求参数、返回参数， 你可以通过点击`编辑`按钮来更改这些信息


<code src="./component/repository_zh.tsx" inline=true></code>
### 团队
Click the organization button on the navigation to enter the organization page, you will see all the organizations that you have joined. If you don't have any organizations, you can click the `create` button to add one.

<code src="./component/organization_zh.tsx" inline=true></code>
### 账户
点击右上方的用户名，可以进入个人信息设置页面，在这里，你可以查看和和更改用户信息

<code src="./component/user_zh.tsx" inline=true></code>
