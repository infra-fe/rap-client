## Mock introduce
- Rap mock is base on the [Mock.js](http://mockjs.com/examples.html) rules, define the rules in the documents, it will automatically generate the data for you. You can find the mock url in your own repository.

<code src="./component/mock_path.tsx" inline=true></code>

## Basic settings
- In the interface edit page, click the `edit` button, switch to the edit mode, and write the rules in the `rule` column, write the value in the `initial value` column. Click the `preview` button, you can check the mock rule on the left, check the mock data on the right.This picture below are shown some usages
<code src="./component/usages.tsx" inline=true></code>

- Mock rule will refresh when you edit
- You can click the `refresh` icon to change the preview data. If you saved, you can access the mock data through the mock server url.

<code src="./component/data_mock.tsx" inline=true></code>
## Default values

- If there are some common rules that you don't want define again and again, you can set a global default value, it is something like the custom rules. Click the `default` button on the operation bar.
Input the name and rules, then back to the edit page, add a custom segment without any rules, and save it, check the mock data.

<code src="./component/default.tsx" inline=true></code>

<code src="./component/setting.tsx" inline=true></code>

<code src="./component/project.tsx" inline=true></code>

<code src="./component/request.tsx" inline=true></code>



