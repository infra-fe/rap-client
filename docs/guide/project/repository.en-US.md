## Create Repository

- Enter the repository page, then click the `create repository` button

<code src="./component/create.tsx" inline=true></code>

- Input all the required segment, then click `submit`, you can add members、organizations、and collaborate repositories(mock data will find the interface in the collaborate repositories if not find in the current repository, it sames like repository extend)

<code src="./component/create_popup_repo.tsx" inline=true></code>
## Edit Repository
- Find the edit button in one repository card, then click it

<code src="./component/edit.tsx" inline=true></code>
## Delete Repository
- You can click the trash button to delete a repository, it is very dangerous to operate, so it will remind you to confirm again

<code src="./component/delete_repo.tsx" inline=true></code>
## Repository Plugin

- Click the plugin button, it will open a new tab to show the plugin usage of this repository

<code src="./component/plugin.tsx" inline=true></code>

## Operation Bar

- When you enter the repository edit page, you can also see a lot of features in the operation bar
<code src="./component/operation.tsx" inline=true></code>

## Repository Settings

- If you want to upload data through RAP openAPI, you may need to get your own repositories token
- Press the `setting` button, it will show your repositories token and all the OpenAPI

<code src="./component/setting.tsx" inline=true></code>
