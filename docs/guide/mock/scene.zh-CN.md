## Mock Scene
在前端开发阶段，对于同一个接口，开发者希望根据请求参数的变化，返回不同的响应内容，而不是频繁的改变配置或者创建不同的接口

- 点击界面上的场景设置按钮，在弹出的窗口中创建或编辑对应的场景
<code src="./component/button_zh.tsx" inline=true></code>

- 通过显式传入 __scene 参数调用场景。 参数值为scene key，在创建scene时自动生成，也可以编辑修改。 同一界面下的场景键不能重复； 【Scene Key】当前默认值为ID，用户可以根据需要命名一个有意义的字符串
<code src="./component/create_zh.tsx" inline=true></code>
<code src="./component/scene_key_zh.tsx" inline=true></code>

- 响应内容是通过写json来设置的。 如果json格式不匹配，格式化或保存时会报错

<code src="./component/json_zh.tsx" inline=true></code>
<code src="./component/data_zh.tsx" inline=true></code>