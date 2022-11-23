# Interface Settings
## Create Interface
- Find the `create interface` button on the left, click it

<code src="./component/create_inf.tsx" inline=true></code>

- Input the basic info of the new interface, click `submit`

<code src="./component/popup_inf.tsx" inline=true></code>
## Edit Interface
- After create a new interface, you can find them in the interface lists at the left of the page, and you can also search an interface at the right of the page.

<code src="./component/list.tsx" inline=true></code>

- Find the `edit` button, then you can edit the basic info, all the requests and responses, after all work have been done, just click the `save` button.

<code src="./component/edit_inf.tsx" inline=true></code>

- Once you click the edit button, this interface will lock by you, and no one can edit it at the same time unless you release it.If you switch to another interface in an edit status, it will kindly remind you.

<code src="./component/lock.tsx" inline=true></code>

### requests
- Requests are split into three types('header'、'query params'、'body params'), you can set the data according to the real api design.
<code src="./component/request.tsx" inline=true></code>
- It is better not include any body params in an `get` and `delete` method interface, if you doing this it will remind you.
<code src="./component/warning.tsx" inline=true></code>
- You can click the `+` or `create`, add a new row, then set the `name`,`required` and other segments.
<code src="./component/add.tsx" inline=true></code>
- If you set an `object` or `array` type, click the `+` before the param, you can add the children of this param
<code src="./component/add_children.tsx" inline=true></code>
### responses
- Responses operation are the same as requests
### import data
- We provide import json5 data through the `import` button, click it, and then input the data, click `submit` button.
<code src="./component/import_button.tsx" inline=true></code>
<code src="./component/import.tsx" inline=true></code>
- You can format the data with the `format` button
### mock preview
- You can add some mock rules in the `generate rule` and `initial value` column, then click `preview` button you will see the mock schema and mock data. For example, if you want to randomly generate one to ten starts, you can set it like below.Know more rules, see [mock rules](https://infra-fe.github.io/rap-client/guide/mock/rule)
<code src="./component/preview.tsx" inline=true></code>
- After save the interface, you can click the mock link to check if the generate data is what you want.
<code src="./component/mock.tsx" inline=true></code>
### sort
- Drag one param row can change the order of the params
<code src="./component/param_order.tsx" inline=true></code>
### shortcuts
- We provide some shortcuts to help you edit more faster

|  key      | feature                                |
| --------- | -------------------------------------- |
| ctrl + c  | copy data structure in focus row       |
| ctrl + v  | data structure to focus place next row |
| ctrl + s  | save data                              |
| ctrl + e  | start to edit                          |
| ctrl + d  | delete focus row                       |

## Sort Interface
- Drag one interface can change the order of the params
<code src="./component/order.tsx" inline=true></code>
## Migrate Interface
- If you want to copy or move a interface into another module or repository, you can just click the `move/copy` button, then select the target repository, target module and the operation type, click `submit` to confirm

<code src="./component/move.tsx" inline=true></code>
## Delete Interface
- Hover the interface, and click the trash button, it can delete the interface, it also need to be confirm again

<code src="./component/delete_inf.tsx" inline=true></code>
## Template

- If an interface structure is very commonly, and you don't want define it again and again, then you make it into a template.

<code src="./component/template.tsx" inline=true></code>

- If you have some templates, you can choose them when you create, the new interface will extend the template's data structure

<code src="./component/create_from_tempalte.tsx" inline=true></code>

## History

- Every key operations will be record in the history part, see [interface history](https://infra-fe.github.io/rap-client/guide/interface/history#interface-history)