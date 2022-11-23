## Mock接口
- Rap是基于 [Mock.js](http://mockjs.com/examples.html)规则提供的数据mock, 只要定义好mock规则，rap服务器就可以自动生成mock数据. 在项目中就可以找到mock的地址。

<code src="./component/mock_path_zh.tsx" inline=true></code>

## 基础设置
- 在界面编辑页面，点击“编辑”按钮，切换到编辑模式，在“规则”栏写入规则，在“初始值”栏写入数值。 点击`预览`按钮，左侧可以查看mock规则，右侧可以查看mock数据。下图是一些用法

<code src="./component/usages_zh.tsx" inline=true></code>

- 当你编辑的时候mock规则会自动刷新
- 也可以点击 `刷新` 来重置预览的数据. 保存以后，就可以通过mock url来访问mock数据了

<code src="./component/data_mock_zh.tsx" inline=true></code>
## 默认值

- 如果有一些常用规则不想反复定义，可以设置一个全局默认值，类似于自定义规则。 单击操作栏上的“默认”按钮。
输入名称和规则，然后回到编辑页面，添加一个没有任何规则的自定义段，并保存，检查模拟数据。

<code src="./component/default_zh.tsx" inline=true></code>

<code src="./component/setting_zh.tsx" inline=true></code>

<code src="./component/project_zh.tsx" inline=true></code>

<code src="./component/request_zh.tsx" inline=true></code>



